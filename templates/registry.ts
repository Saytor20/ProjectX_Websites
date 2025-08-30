import React, { ComponentType } from 'react';
import { Restaurant } from '@/lib/schema';

// Template imports
import BistlyTemplate from './bistly/Template';
import bistlyManifest from './bistly/manifest.json';
import SimpleModernTemplate from './simple-modern/Template';
import simpleModernManifest from './simple-modern/manifest.json';
import RoyateTemplate from './royate/Template';
import royateManifest from './royate/manifest.json';
import FooderaTemplate from './foodera/Template';
import fooderaManifest from './foodera/manifest.json';
import MehuTemplate from './mehu/Template';
import mehuManifest from './mehu/manifest.json';
import SharaTemplate from './shara/Template';
import sharaManifest from './shara/manifest.json';
import FooderaV2Template from './foodera-v2/Template';
import fooderaV2Manifest from './foodera-v2/manifest.json';
import TastyTemplate from './tasty/Template';
import tastyManifest from './tasty/manifest.json';
import CallixTemplate from './callix/Template';
import callixManifest from './callix/manifest.json';
import CoillTemplate from './coill/Template';
import coillManifest from './coill/manifest.json';

// Template component interface
export interface TemplateComponent {
  (props: { restaurant: Restaurant }): React.JSX.Element;
}

// Template manifest interface
export interface TemplateManifest {
  id: string;
  name: string;
  description?: string;
  slots: string[];
  version: string;
  author?: string;
  tags?: string[];
  preview?: string;
}

// Template registry entry
export interface TemplateRegistryEntry {
  id: string;
  component: ComponentType<{ restaurant: Restaurant }>;
  manifest: TemplateManifest;
}

// Registry of all templates
const templateRegistry: Record<string, TemplateRegistryEntry> = {
  bistly: {
    id: 'bistly',
    component: BistlyTemplate,
    manifest: bistlyManifest as TemplateManifest,
  },
  'simple-modern': {
    id: 'simple-modern',
    component: SimpleModernTemplate,
    manifest: simpleModernManifest as TemplateManifest,
  },
  royate: {
    id: 'royate',
    component: RoyateTemplate,
    manifest: royateManifest as TemplateManifest,
  },
  foodera: {
    id: 'foodera',
    component: FooderaTemplate,
    manifest: fooderaManifest as TemplateManifest,
  },
  mehu: {
    id: 'mehu',
    component: MehuTemplate,
    manifest: mehuManifest as TemplateManifest,
  },
  shara: {
    id: 'shara',
    component: SharaTemplate,
    manifest: sharaManifest as TemplateManifest,
  },
  'foodera-v2': {
    id: 'foodera-v2',
    component: FooderaV2Template,
    manifest: fooderaV2Manifest as TemplateManifest,
  },
  tasty: {
    id: 'tasty',
    component: TastyTemplate,
    manifest: tastyManifest as TemplateManifest,
  },
  callix: {
    id: 'callix',
    component: CallixTemplate,
    manifest: callixManifest as TemplateManifest,
  },
  coill: {
    id: 'coill',
    component: CoillTemplate,
    manifest: coillManifest as TemplateManifest,
  },
};

/**
 * Get a template by ID
 */
export function getTemplate(id: string): TemplateRegistryEntry | null {
  const template = templateRegistry[id];
  return template || null;
}

/**
 * Get all available templates
 */
export function listTemplates(): TemplateManifest[] {
  return Object.values(templateRegistry).map(entry => entry.manifest);
}

/**
 * Check if a template exists
 */
export function hasTemplate(id: string): boolean {
  return id in templateRegistry;
}

/**
 * Get template IDs
 */
export function getTemplateIds(): string[] {
  return Object.keys(templateRegistry);
}

/**
 * Get template count
 */
export function getTemplateCount(): number {
  return Object.keys(templateRegistry).length;
}
