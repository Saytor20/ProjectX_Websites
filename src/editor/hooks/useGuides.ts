import { useEffect, useRef } from 'react';
import { GuidesOptions } from '../types';
import { getFeatureFlags } from '../../lib/feature-flags';

const defaultOptions: GuidesOptions = {
  type: 'horizontal',
  snapThreshold: 5,
  isDisplaySnapDigit: true,
  snapGap: true,
  snapElement: true,
  snapCenter: true,
};

export const useGuides = (showGuides: boolean) => {
  const guidesRef = useRef<HTMLDivElement>(null);
  const horizontalGuidesRef = useRef<HTMLDivElement | null>(null);
  const verticalGuidesRef = useRef<HTMLDivElement | null>(null);
  const featureFlags = getFeatureFlags();

  useEffect(() => {
    if (!featureFlags.GUIDES_SNAPPING || !guidesRef.current) {
      return;
    }

    // Create guides containers if they don't exist
    if (!horizontalGuidesRef.current) {
      horizontalGuidesRef.current = document.createElement('div');
      horizontalGuidesRef.current.className = 'editor-guides-horizontal';
      horizontalGuidesRef.current.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 100vh;
        pointer-events: none;
        z-index: 9998;
      `;
      guidesRef.current.appendChild(horizontalGuidesRef.current);
    }

    if (!verticalGuidesRef.current) {
      verticalGuidesRef.current = document.createElement('div');
      verticalGuidesRef.current.className = 'editor-guides-vertical';
      verticalGuidesRef.current.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: 100vw;
        pointer-events: none;
        z-index: 9998;
      `;
      guidesRef.current.appendChild(verticalGuidesRef.current);
    }

    // Show/hide guides based on showGuides prop
    if (horizontalGuidesRef.current && verticalGuidesRef.current) {
      horizontalGuidesRef.current.style.display = showGuides ? 'block' : 'none';
      verticalGuidesRef.current.style.display = showGuides ? 'block' : 'none';
    }

    return () => {
      // Cleanup guides when component unmounts
      if (horizontalGuidesRef.current && horizontalGuidesRef.current.parentNode) {
        horizontalGuidesRef.current.parentNode.removeChild(horizontalGuidesRef.current);
        horizontalGuidesRef.current = null;
      }
      if (verticalGuidesRef.current && verticalGuidesRef.current.parentNode) {
        verticalGuidesRef.current.parentNode.removeChild(verticalGuidesRef.current);
        verticalGuidesRef.current = null;
      }
    };
  }, [showGuides, featureFlags.GUIDES_SNAPPING]);

  // Method to add a horizontal guide at y position
  const addHorizontalGuide = (y: number) => {
    if (!horizontalGuidesRef.current) return;

    const guide = document.createElement('div');
    guide.className = 'editor-guide-line horizontal';
    guide.style.cssText = `
      position: absolute;
      top: ${y}px;
      left: 0;
      right: 0;
      height: 1px;
      background: #ff4757;
      box-shadow: 0 0 2px rgba(255, 71, 87, 0.5);
    `;
    horizontalGuidesRef.current.appendChild(guide);

    // Auto remove after 2 seconds
    setTimeout(() => {
      if (guide.parentNode) {
        guide.parentNode.removeChild(guide);
      }
    }, 2000);
  };

  // Method to add a vertical guide at x position
  const addVerticalGuide = (x: number) => {
    if (!verticalGuidesRef.current) return;

    const guide = document.createElement('div');
    guide.className = 'editor-guide-line vertical';
    guide.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: 0;
      bottom: 0;
      width: 1px;
      background: #ff4757;
      box-shadow: 0 0 2px rgba(255, 71, 87, 0.5);
    `;
    verticalGuidesRef.current.appendChild(guide);

    // Auto remove after 2 seconds
    setTimeout(() => {
      if (guide.parentNode) {
        guide.parentNode.removeChild(guide);
      }
    }, 2000);
  };

  // Method to clear all guides
  const clearGuides = () => {
    if (horizontalGuidesRef.current) {
      horizontalGuidesRef.current.innerHTML = '';
    }
    if (verticalGuidesRef.current) {
      verticalGuidesRef.current.innerHTML = '';
    }
  };

  // Method to show snap guides for element alignment
  const showSnapGuides = (targetRect: DOMRect, allElements: HTMLElement[]) => {
    clearGuides();

    const threshold = defaultOptions.snapThreshold;
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    allElements.forEach(element => {
      if (!element.getBoundingClientRect) return;
      
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Check for horizontal alignment
      if (Math.abs(targetCenterY - centerY) < threshold) {
        addHorizontalGuide(centerY);
      }
      if (Math.abs(targetRect.top - rect.top) < threshold) {
        addHorizontalGuide(rect.top);
      }
      if (Math.abs(targetRect.bottom - rect.bottom) < threshold) {
        addHorizontalGuide(rect.bottom);
      }

      // Check for vertical alignment
      if (Math.abs(targetCenterX - centerX) < threshold) {
        addVerticalGuide(centerX);
      }
      if (Math.abs(targetRect.left - rect.left) < threshold) {
        addVerticalGuide(rect.left);
      }
      if (Math.abs(targetRect.right - rect.right) < threshold) {
        addVerticalGuide(rect.right);
      }
    });
  };

  return { 
    guidesRef,
    addHorizontalGuide,
    addVerticalGuide,
    clearGuides,
    showSnapGuides
  };
};