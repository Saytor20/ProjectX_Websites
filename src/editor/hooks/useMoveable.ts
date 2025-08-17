import { useEffect, useRef } from 'react';
import Moveable from 'moveable';
import { EditorContext, MoveableOptions, HistoryState, ElementState } from '../types';
import { getFeatureFlags } from '../../lib/feature-flags';

const defaultOptions: MoveableOptions = {
  draggable: true,
  resizable: true,
  rotatable: true,
  scalable: false,
  snappable: true,
  bounds: true,
  keepRatio: false,
};

export const useMoveable = (targets: HTMLElement[], context: EditorContext) => {
  const moveableRef = useRef<HTMLDivElement>(null);
  const moveableInstance = useRef<Moveable | null>(null);
  const featureFlags = getFeatureFlags();

  useEffect(() => {
    if (!featureFlags.MOVEABLE_INTERACTIONS || !moveableRef.current) {
      return;
    }

    // Cleanup previous instance
    if (moveableInstance.current) {
      moveableInstance.current.destroy();
    }

    // Create new moveable instance
    moveableInstance.current = new Moveable(moveableRef.current, {
      target: targets,
      ...defaultOptions,
      renderDirections: ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'],
      edge: false,
      zoom: 1,
      origin: true,
      padding: { left: 0, top: 0, right: 0, bottom: 0 },
      snappable: true,
      snapThreshold: 5,
      elementSnapDirections: {
        top: true,
        left: true,
        bottom: true,
        right: true,
        center: true,
        middle: true,
      },
      snapGap: true,
      snapElement: true,
      snapDistFormat: (v: number) => `${v}px`,
      isDisplaySnapDigit: true,
      snapDigit: 0,
      snapRenderThreshold: 1,
    });

    // Helper function to capture element state
    const captureElementState = (element: HTMLElement): ElementState => {
      const rect = element.getBoundingClientRect();
      const transform = element.style.transform;
      const rotation = transform.match(/rotate\(([-\d.]+)deg\)/)?.[1] || '0';
      
      return {
        position: { 
          x: parseFloat(element.style.left) || rect.left,
          y: parseFloat(element.style.top) || rect.top
        },
        size: { 
          width: rect.width, 
          height: rect.height 
        },
        rotation: parseFloat(rotation),
        styles: {
          transform: element.style.transform,
          width: element.style.width,
          height: element.style.height,
          left: element.style.left,
          top: element.style.top,
        }
      };
    };

    let beforeState: ElementState | null = null;

    // Drag start
    moveableInstance.current.on('dragStart', (e) => {
      beforeState = captureElementState(e.target);
    });

    // Drag
    moveableInstance.current.on('drag', (e) => {
      e.target.style.transform = e.transform;
    });

    // Drag end
    moveableInstance.current.on('dragEnd', (e) => {
      if (beforeState) {
        const afterState = captureElementState(e.target);
        const historyState: HistoryState = {
          id: `drag-${Date.now()}`,
          timestamp: Date.now(),
          type: 'move',
          elementId: e.target.id || `element-${Date.now()}`,
          beforeState,
          afterState
        };
        context.addToHistory(historyState);
      }
    });

    // Resize start
    moveableInstance.current.on('resizeStart', (e) => {
      beforeState = captureElementState(e.target);
    });

    // Resize
    moveableInstance.current.on('resize', (e) => {
      e.target.style.width = `${e.width}px`;
      e.target.style.height = `${e.height}px`;
      e.target.style.transform = e.drag.transform;
    });

    // Resize end
    moveableInstance.current.on('resizeEnd', (e) => {
      if (beforeState) {
        const afterState = captureElementState(e.target);
        const historyState: HistoryState = {
          id: `resize-${Date.now()}`,
          timestamp: Date.now(),
          type: 'resize',
          elementId: e.target.id || `element-${Date.now()}`,
          beforeState,
          afterState
        };
        context.addToHistory(historyState);
      }
    });

    // Rotate start
    moveableInstance.current.on('rotateStart', (e) => {
      beforeState = captureElementState(e.target);
    });

    // Rotate
    moveableInstance.current.on('rotate', (e) => {
      e.target.style.transform = e.drag.transform;
    });

    // Rotate end
    moveableInstance.current.on('rotateEnd', (e) => {
      if (beforeState) {
        const afterState = captureElementState(e.target);
        const historyState: HistoryState = {
          id: `rotate-${Date.now()}`,
          timestamp: Date.now(),
          type: 'resize', // Using resize type for rotation for simplicity
          elementId: e.target.id || `element-${Date.now()}`,
          beforeState,
          afterState
        };
        context.addToHistory(historyState);
      }
    });

    return () => {
      if (moveableInstance.current) {
        moveableInstance.current.destroy();
        moveableInstance.current = null;
      }
    };
  }, [targets, context, featureFlags.MOVEABLE_INTERACTIONS]);

  // Update targets when selection changes
  useEffect(() => {
    if (moveableInstance.current) {
      moveableInstance.current.target = targets;
    }
  }, [targets]);

  return { moveableRef };
};