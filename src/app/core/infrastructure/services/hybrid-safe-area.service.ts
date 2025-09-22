import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { ISafeAreaService, SafeAreaInsets } from '../../domain/interfaces/safe-area.interface';

/**
 * Servicio híbrido para manejar Safe Area en web y dispositivos móviles
 * Utiliza CSS env() variables para obtener información sobre barras del sistema
 * 
 * Arquitectura Hexagonal:
 * - Puerto: ISafeAreaService (dominio)
 * - Adaptador: HybridSafeAreaService (infraestructura)
 */
@Injectable({
  providedIn: 'root'
})
export class HybridSafeAreaService implements ISafeAreaService {
  
  private readonly isNativePlatform: boolean = Capacitor.isNativePlatform();

  /**
   * Obtiene los insets del área segura usando CSS env() variables
   */
  async getSafeAreaInsets(): Promise<SafeAreaInsets> {
    try {
      if (this.isNativePlatform) {
        return await this.getNativeSafeAreaInsets();
      } else {
        return await this.getWebSafeAreaInsets();
      }
    } catch (error) {
      console.error('Error obteniendo Safe Area insets:', error);
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }
  }

  /**
   * Calcula la altura disponible descontando barras superior e inferior
   */
  async getAvailableHeight(): Promise<number> {
    try {
      const insets = await this.getSafeAreaInsets();
      const totalHeight = window.screen?.height || window.innerHeight;
      
      const availableHeight = totalHeight - insets.top - insets.bottom;
      console.log('SafeArea - Altura disponible:', availableHeight, 'px');
      
      return Math.max(availableHeight, 300); // Mínimo 300px por seguridad
    } catch (error) {
      console.error('Error calculando altura disponible:', error);
      return window.innerHeight;
    }
  }

  /**
   * Calcula el ancho disponible descontando barras laterales
   */
  async getAvailableWidth(): Promise<number> {
    try {
      const insets = await this.getSafeAreaInsets();
      const totalWidth = window.screen?.width || window.innerWidth;
      
      const availableWidth = totalWidth - insets.left - insets.right;
      console.log('SafeArea - Ancho disponible:', availableWidth, 'px');
      
      return Math.max(availableWidth, 320); // Mínimo 320px por seguridad
    } catch (error) {
      console.error('Error calculando ancho disponible:', error);
      return window.innerWidth;
    }
  }

  /**
   * Verifica si la plataforma tiene barras de navegación del sistema
   */
  async hasSystemBars(): Promise<boolean> {
    const insets = await this.getSafeAreaInsets();
    return insets.top > 0 || insets.bottom > 0 || insets.left > 0 || insets.right > 0;
  }

  /**
   * Obtiene safe area insets usando múltiples métodos de detección
   */
  private async getNativeSafeAreaInsets(): Promise<SafeAreaInsets> {
    return new Promise((resolve) => {
      // Método 1: CSS env() variables
      const envInsets = this.getCSSEnvInsets();
      
      // Método 2: Detección por viewport
      const viewportInsets = this.getViewportDifferenceInsets();
      
      // Método 3: Heurísticas por plataforma
      const heuristicInsets = this.getHeuristicInsets();
      
      // Usar el método que dé valores más realistas
      const insets: SafeAreaInsets = {
        top: Math.max(envInsets.top, viewportInsets.top, heuristicInsets.top),
        bottom: Math.max(envInsets.bottom, viewportInsets.bottom, heuristicInsets.bottom),
        left: Math.max(envInsets.left, viewportInsets.left, heuristicInsets.left),
        right: Math.max(envInsets.right, viewportInsets.right, heuristicInsets.right)
      };
      
      console.log('SafeArea - Métodos de detección:');
      console.log('  CSS env():', envInsets);
      console.log('  Viewport:', viewportInsets);
      console.log('  Heurísticas:', heuristicInsets);
      console.log('  Final:', insets);
      
      resolve(insets);
    });
  }

  /**
   * Método 1: CSS env() variables
   */
  private getCSSEnvInsets(): SafeAreaInsets {
    const testElement = document.createElement('div');
    testElement.style.position = 'fixed';
    testElement.style.top = 'env(safe-area-inset-top, 0px)';
    testElement.style.bottom = 'env(safe-area-inset-bottom, 0px)';
    testElement.style.left = 'env(safe-area-inset-left, 0px)';
    testElement.style.right = 'env(safe-area-inset-right, 0px)';
    testElement.style.visibility = 'hidden';
    
    document.body.appendChild(testElement);
    const computedStyle = getComputedStyle(testElement);
    
    const insets = {
      top: this.parsePxValue(computedStyle.top),
      bottom: this.parsePxValue(computedStyle.bottom),
      left: this.parsePxValue(computedStyle.left),
      right: this.parsePxValue(computedStyle.right)
    };
    
    document.body.removeChild(testElement);
    return insets;
  }

  /**
   * Método 2: Diferencias entre screen y viewport - VALORES AJUSTADOS
   */
  private getViewportDifferenceInsets(): SafeAreaInsets {
    const screenHeight = window.screen?.height || window.outerHeight;
    const viewportHeight = window.innerHeight;
    const heightDiff = screenHeight - viewportHeight;

    // Distribución más equilibrada y valores más conservadores
    return {
      top: heightDiff > 20 ? Math.min(heightDiff * 0.35, 28) : 0,  // Reducido de 30 a 28
      bottom: heightDiff > 20 ? Math.min(heightDiff * 0.65, 42) : 0, // Reducido de 50 a 42
      left: 0,
      right: 0,
    };
  }

  /**
   * Método 3: Heurísticas por plataforma - VALORES AJUSTADOS
   */
  private getHeuristicInsets(): SafeAreaInsets {
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = userAgent.includes('android');

    if (isAndroid) {
      return {
        top: 18,  // Reducido de 20 a 18
        bottom: 32, // Reducido de 36 a 32
        left: 0,
        right: 0
      };
    }

    return { top: 0, bottom: 0, left: 0, right: 0 };
  }

  /**
   * Obtiene safe area insets para web (generalmente 0)
   */
  private async getWebSafeAreaInsets(): Promise<SafeAreaInsets> {
    // En web normalmente no hay barras del sistema
    const insets = { top: 0, bottom: 0, left: 0, right: 0 };
    console.log('SafeArea - Insets web:', insets);
    return insets;
  }

  /**
   * Convierte valor CSS en px a número
   */
  private parsePxValue(value: string): number {
    if (!value || value === '0px' || value === 'auto') return 0;
    const regex = /^(\d+(?:\.\d+)?)px$/;
    const match = regex.exec(value);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Método para debug - muestra información completa del safe area
   */
  async debugSafeAreaInfo(): Promise<void> {
    console.group('🔍 Safe Area Debug Info');
    console.log('Plataforma nativa:', this.isNativePlatform);
    console.log('Screen dimensions:', window.screen?.width, 'x', window.screen?.height);
    console.log('Viewport dimensions:', window.innerWidth, 'x', window.innerHeight);
    
    const insets = await this.getSafeAreaInsets();
    console.log('Safe area insets:', insets);
    
    const availableHeight = await this.getAvailableHeight();
    const availableWidth = await this.getAvailableWidth();
    console.log('Dimensiones disponibles:', availableWidth, 'x', availableHeight);
    
    const hasSystemBars = await this.hasSystemBars();
    console.log('Tiene barras del sistema:', hasSystemBars);
    console.groupEnd();
  }
}