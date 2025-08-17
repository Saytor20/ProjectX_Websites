/**
 * Mapping DSL Engine
 * 
 * Processes map.yml files to generate component trees.
 * Supports conditionals (when), iteration (each), and safe functions.
 */

import * as yaml from 'js-yaml';
import { JSONPath } from 'jsonpath-plus';
import type { SiteSchema } from '@/schema/core';
import type { ComponentMapping } from '@/components/kit/types';

// Mapping DSL structure
export interface MappingNode {
  as: string;
  variant?: string;
  props?: Record<string, any>;
  when?: string; // JSONPath condition
  each?: string; // JSONPath array to iterate
  else?: MappingNode[]; // Fallback nodes if condition fails
  children?: MappingNode[];
}

export interface PageMapping {
  layout: MappingNode[];
}

export interface MappingConfig {
  page: PageMapping;
}

// Safe function library
export class SafeFunctions {
  private locale: string;
  private timezone: string;

  constructor(locale: string = 'en', timezone: string = 'UTC') {
    this.locale = locale;
    this.timezone = timezone;
  }

  // Truncate text to specified length
  truncate(text: string | undefined, length: number): string {
    if (!text) return '';
    if (text.length <= length) return text;
    
    const truncated = text.substring(0, length - 3);
    const lastSpace = truncated.lastIndexOf(' ');
    
    // Try to break at word boundary
    return lastSpace > length * 0.8 ? 
      truncated.substring(0, lastSpace) + '...' : 
      truncated + '...';
  }

  // Join array elements with separator
  join(array: any[] | undefined, separator: string = ', '): string {
    if (!Array.isArray(array)) return '';
    return array.filter(Boolean).join(separator);
  }

  // Format currency amount
  currency(amount: number | undefined, currencyCode: string = 'SAR'): string {
    if (typeof amount !== 'number') return '';
    
    try {
      return new Intl.NumberFormat(this.locale === 'ar' ? 'ar-SA' : 'en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${amount} ${currencyCode}`;
    }
  }

  // Format date/time
  date(timestamp: string | Date | undefined, format: 'short' | 'medium' | 'long' = 'medium'): string {
    if (!timestamp) return '';
    
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    if (isNaN(date.getTime())) return '';

    const options: Intl.DateTimeFormatOptions = {
      timeZone: this.timezone,
    };

    switch (format) {
      case 'short':
        options.dateStyle = 'short';
        break;
      case 'long':
        options.dateStyle = 'full';
        options.timeStyle = 'short';
        break;
      case 'medium':
      default:
        options.dateStyle = 'medium';
        break;
    }

    try {
      return new Intl.DateTimeFormat(this.locale, options).format(date);
    } catch {
      return date.toISOString().split('T')[0]; // Fallback to YYYY-MM-DD
    }
  }

  // Convert to lowercase
  lower(text: string | undefined): string {
    return text?.toLowerCase() || '';
  }

  // Convert to uppercase  
  upper(text: string | undefined): string {
    return text?.toUpperCase() || '';
  }

  // Capitalize first letter
  capitalize(text: string | undefined): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  // Get first N items from array
  first(array: any[] | undefined, count: number = 1): any[] {
    if (!Array.isArray(array)) return [];
    return array.slice(0, count);
  }

  // Get last N items from array
  last(array: any[] | undefined, count: number = 1): any[] {
    if (!Array.isArray(array)) return [];
    return array.slice(-count);
  }

  // Default value if null/undefined
  default(value: any, defaultValue: any): any {
    return value !== null && value !== undefined ? value : defaultValue;
  }
}

// Sandboxed expression evaluator
export class ExpressionEvaluator {
  private functions: SafeFunctions;
  private timeout: number;

  constructor(locale: string = 'en', timezone: string = 'UTC', timeout: number = 100) {
    this.functions = new SafeFunctions(locale, timezone);
    this.timeout = timeout;
  }

  // Evaluate JSONPath expression with timeout protection
  evaluateJsonPath(data: any, expression: string): any {
    const startTime = Date.now();
    
    try {
      // Basic security check - no dangerous patterns
      if (this.containsDangerousPatterns(expression)) {
        throw new Error(`Dangerous pattern detected in expression: ${expression}`);
      }

      const result = JSONPath({ path: expression, json: data });
      
      // Timeout check
      if (Date.now() - startTime > this.timeout) {
        throw new Error(`JSONPath evaluation timeout: ${expression}`);
      }

      return result.length === 1 ? result[0] : result;
    } catch (error) {
      console.warn(`JSONPath evaluation failed: ${expression}`, error);
      return null;
    }
  }

  // Process function calls in expressions
  processFunctionCall(value: any, functionCall: string): any {
    const startTime = Date.now();
    
    try {
      // Parse function call: functionName(arg1, arg2, ...)
      const match = functionCall.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\((.*)\)$/);
      if (!match) {
        throw new Error(`Invalid function syntax: ${functionCall}`);
      }

      const [, functionName, argsString] = match;
      
      // Check if function exists in safe functions
      if (!(functionName in this.functions)) {
        throw new Error(`Unknown function: ${functionName}`);
      }

      // Parse arguments (simplified - supports strings, numbers, booleans)
      const args = this.parseArguments(argsString);
      
      // Timeout check
      if (Date.now() - startTime > this.timeout) {
        throw new Error(`Function evaluation timeout: ${functionCall}`);
      }

      // Call function
      const func = (this.functions as any)[functionName];
      return func.apply(this.functions, [value, ...args]);
    } catch (error) {
      console.warn(`Function call failed: ${functionCall}`, error);
      return value; // Return original value on error
    }
  }

  // Check for dangerous patterns in expressions
  private containsDangerousPatterns(expression: string): boolean {
    const dangerousPatterns = [
      /eval\s*\(/,
      /Function\s*\(/,
      /setTimeout\s*\(/,
      /setInterval\s*\(/,
      /require\s*\(/,
      /import\s*\(/,
      /process\./,
      /global\./,
      /window\./,
      /document\./,
      /__proto__/,
      /constructor/,
      /prototype/,
    ];

    return dangerousPatterns.some(pattern => pattern.test(expression));
  }

  // Simple argument parser (supports basic types)
  private parseArguments(argsString: string): any[] {
    if (!argsString.trim()) return [];
    
    const args: any[] = [];
    const parts = argsString.split(',');
    
    for (const part of parts) {
      const trimmed = part.trim();
      
      // String literal
      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        args.push(trimmed.slice(1, -1));
      }
      // String literal with single quotes
      else if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
        args.push(trimmed.slice(1, -1));
      }
      // Number
      else if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
        args.push(parseFloat(trimmed));
      }
      // Boolean
      else if (trimmed === 'true') {
        args.push(true);
      }
      else if (trimmed === 'false') {
        args.push(false);
      }
      // Null
      else if (trimmed === 'null') {
        args.push(null);
      }
      // Default to string
      else {
        args.push(trimmed);
      }
    }
    
    return args;
  }
}

// Main mapping processor
export class MappingProcessor {
  private evaluator: ExpressionEvaluator;
  private diagnostics: string[];

  constructor(locale: string = 'en', timezone: string = 'UTC') {
    this.evaluator = new ExpressionEvaluator(locale, timezone);
    this.diagnostics = [];
  }

  // Load mapping from YAML string
  loadMapping(yamlContent: string): MappingConfig {
    try {
      const config = yaml.load(yamlContent) as MappingConfig;
      this.validateMapping(config);
      return config;
    } catch (error) {
      throw new Error(`Failed to load mapping: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Process mapping with data to generate component mappings
  processMapping(config: MappingConfig, data: SiteSchema): ComponentMapping[] {
    this.diagnostics = [];
    
    try {
      return this.processNodes(config.page.layout, data);
    } catch (error) {
      this.diagnostics.push(`Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return [];
    }
  }

  // Get processing diagnostics
  getDiagnostics(): string[] {
    return [...this.diagnostics];
  }

  // Process array of mapping nodes
  private processNodes(nodes: MappingNode[], data: SiteSchema, context: any = {}): ComponentMapping[] {
    const results: ComponentMapping[] = [];

    for (const node of nodes) {
      try {
        const processedNodes = this.processNode(node, data, context);
        results.push(...processedNodes);
      } catch (error) {
        this.diagnostics.push(`Node processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return results;
  }

  // Process single mapping node
  private processNode(node: MappingNode, data: SiteSchema, context: any = {}): ComponentMapping[] {
    // Handle conditional rendering
    if (node.when) {
      const conditionResult = this.evaluateCondition(node.when, data, context);
      if (!conditionResult) {
        // Process else nodes if condition fails
        if (node.else) {
          return this.processNodes(node.else, data, context);
        }
        return [];
      }
    }

    // Handle iteration
    if (node.each) {
      return this.processIteration(node, data, context);
    }

    // Process regular node
    const processedProps = this.processProps(node.props || {}, data, context);
    
    const mapping: ComponentMapping = {
      as: node.as as any,
      variant: node.variant,
      props: processedProps,
    };

    // Process children if present
    if (node.children) {
      const childMappings = this.processNodes(node.children, data, context);
      if (childMappings.length > 0) {
        mapping.props.children = childMappings;
      }
    }

    return [mapping];
  }

  // Evaluate conditional expression
  private evaluateCondition(condition: string, data: SiteSchema, context: any): boolean {
    try {
      const value = this.evaluateExpression(condition, data, context);
      
      // Handle different value types
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === 'object' && value !== null) {
        return Object.keys(value).length > 0;
      }
      
      return Boolean(value);
    } catch (error) {
      this.diagnostics.push(`Condition evaluation failed: ${condition} - ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  // Process iteration over array
  private processIteration(node: MappingNode, data: SiteSchema, context: any): ComponentMapping[] {
    if (!node.each) return [];

    try {
      const arrayValue = this.evaluateExpression(node.each, data, context);
      
      if (!Array.isArray(arrayValue)) {
        this.diagnostics.push(`Each expression did not return array: ${node.each}`);
        return [];
      }

      const results: ComponentMapping[] = [];
      
      for (let i = 0; i < arrayValue.length; i++) {
        const item = arrayValue[i];
        const itemContext = {
          ...context,
          $item: item,
          $index: i,
          $first: i === 0,
          $last: i === arrayValue.length - 1,
        };

        // Process node for each item
        const nodeClone = { ...node };
        delete nodeClone.each; // Remove iteration directive
        
        const itemResults = this.processNode(nodeClone, data, itemContext);
        results.push(...itemResults);
      }

      return results;
    } catch (error) {
      this.diagnostics.push(`Iteration failed: ${node.each} - ${error instanceof Error ? error.message : 'Unknown error'}`);
      return [];
    }
  }

  // Process props object with expression resolution
  private processProps(props: Record<string, any>, data: SiteSchema, context: any): Record<string, any> {
    const processed: Record<string, any> = {};

    for (const [key, value] of Object.entries(props)) {
      try {
        processed[key] = this.processValue(value, data, context);
      } catch (error) {
        this.diagnostics.push(`Prop processing failed: ${key} - ${error instanceof Error ? error.message : 'Unknown error'}`);
        processed[key] = null;
      }
    }

    return processed;
  }

  // Process individual value with expression evaluation
  private processValue(value: any, data: SiteSchema, context: any): any {
    if (typeof value === 'string' && value.startsWith('$')) {
      // Handle different expression types
      if (value.includes('|')) {
        // Function pipeline: $.path | function(args)
        return this.processFunctionPipeline(value, data, context);
      } else if (value.includes('??')) {
        // Default value: $.path ?? "fallback"
        return this.processDefaultValue(value, data, context);
      } else {
        // Simple JSONPath: $.path
        return this.evaluateExpression(value, data, context);
      }
    }
    
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return value.map(item => this.processValue(item, data, context));
      } else {
        return this.processProps(value, data, context);
      }
    }
    
    return value;
  }

  // Process function pipeline: $.path | function(args)
  private processFunctionPipeline(expression: string, data: SiteSchema, context: any): any {
    const parts = expression.split('|').map(p => p.trim());
    let result = this.evaluateExpression(parts[0], data, context);

    for (let i = 1; i < parts.length; i++) {
      const functionCall = parts[i];
      result = this.evaluator.processFunctionCall(result, functionCall);
    }

    return result;
  }

  // Process default value: $.path ?? "fallback"
  private processDefaultValue(expression: string, data: SiteSchema, context: any): any {
    const parts = expression.split('??').map(p => p.trim());
    const value = this.evaluateExpression(parts[0], data, context);
    
    if (value !== null && value !== undefined) {
      return value;
    }
    
    if (parts.length > 1) {
      // Parse fallback value
      const fallback = parts[1];
      if (fallback.startsWith('"') && fallback.endsWith('"')) {
        return fallback.slice(1, -1); // String literal
      }
      if (fallback.startsWith('$')) {
        return this.evaluateExpression(fallback, data, context); // Another expression
      }
      return fallback; // Literal value
    }
    
    return null;
  }

  // Evaluate expression with context support
  private evaluateExpression(expression: string, data: SiteSchema, context: any): any {
    // Handle context variables
    if (expression === '$item') {
      return context.$item;
    }
    if (expression === '$index') {
      return context.$index;
    }
    if (expression === '$first') {
      return context.$first;
    }
    if (expression === '$last') {
      return context.$last;
    }

    // Handle JSONPath on context item
    if (expression.startsWith('$item.')) {
      const itemPath = expression.replace('$item.', '$.');
      return this.evaluator.evaluateJsonPath(context.$item, itemPath);
    }

    // Regular JSONPath on main data
    return this.evaluator.evaluateJsonPath(data, expression);
  }

  // Validate mapping configuration
  private validateMapping(config: MappingConfig): void {
    if (!config.page?.layout) {
      throw new Error('Mapping must have page.layout');
    }

    if (!Array.isArray(config.page.layout)) {
      throw new Error('page.layout must be an array');
    }

    this.validateNodes(config.page.layout);
  }

  // Validate array of nodes
  private validateNodes(nodes: MappingNode[]): void {
    for (const node of nodes) {
      this.validateNode(node);
    }
  }

  // Validate single node
  private validateNode(node: MappingNode): void {
    if (!node.as || typeof node.as !== 'string') {
      throw new Error('Each node must have a valid "as" component name');
    }

    if (node.when && typeof node.when !== 'string') {
      throw new Error('"when" condition must be a string');
    }

    if (node.each && typeof node.each !== 'string') {
      throw new Error('"each" expression must be a string');
    }

    if (node.children) {
      this.validateNodes(node.children);
    }

    if (node.else) {
      this.validateNodes(node.else);
    }
  }
}