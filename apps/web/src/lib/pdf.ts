### **apps/web/src/lib/pdf.ts**

```typescript
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export interface ExportOptions {
  filename?: string
  scale?: number
  format?: 'a4' | 'letter'
  orientation?: 'portrait' | 'landscape'
  compress?: boolean
}

export class PDFExporter {
  static async exportToPDF(
    element: HTMLElement,
    options: ExportOptions = {}
  ): Promise<void> {
    const {
      filename = `Resume_${new Date().toISOString().split('T')[0]}.pdf`,
      scale = 3,
      format = 'a4',
      orientation = 'portrait',
      compress = true,
    } = options
    
    // Show loading indicator
    const loadingDiv = this.createLoadingIndicator()
    document.body.appendChild(loadingDiv)
    
    try {
      // Generate high-quality canvas
      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 0,
        removeContainer: false,
        foreignObjectRendering: true,
      })
      
      // Create PDF
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format,
        compress,
      })
      
      // Calculate dimensions
      const imgWidth = pdf.internal.pageSize.getWidth()
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const pageHeight = pdf.internal.pageSize.getHeight()
      
      // Add image to PDF
      const imgData = canvas.toDataURL('image/png', 1.0)
      
      if (imgHeight <= pageHeight) {
        // Single page
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST')
      } else {
        // Multiple pages
        let position = 0
        let remainingHeight = imgHeight
        
        while (remainingHeight > 0) {
          if (position !== 0) {
            pdf.addPage()
          }
          
          const currentHeight = Math.min(pageHeight, remainingHeight)
          
          pdf.addImage(
            imgData,
            'PNG',
            0,
            position === 0 ? 0 : -position,
            imgWidth,
            imgHeight,
            undefined,
            'FAST'
          )
          
          position += pageHeight
          remainingHeight -= pageHeight
        }
      }
      
      // Save PDF
      pdf.save(filename)
      
      // Track export
      this.trackExport(filename, 'pdf')
      
    } catch (error) {
      console.error('PDF export failed:', error)
      throw new Error('PDF导出失败，请重试')
    } finally {
      // Remove loading indicator
      document.body.removeChild(loadingDiv)
    }
  }
  
  static async exportToImage(
    element: HTMLElement,
    format: 'png' | 'jpeg' = 'png',
    quality: number = 0.95
  ): Promise<void> {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    })
    
    const link = document.createElement('a')
    link.download = `Resume_${new Date().toISOString().split('T')[0]}.${format}`
    link.href = canvas.toDataURL(`image/${format}`, quality)
    link.click()
    
    this.trackExport(link.download, format)
  }
  
  private static createLoadingIndicator(): HTMLDivElement {
    const div = document.createElement('div')
    div.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 20px 30px;
        border-radius: 8px;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin">
          <path d="M21 12a9 9 0 11-6.219-8.56" />
        </svg>
        正在生成高质量PDF...
      </div>
    `
    return div
  }
  
  private static trackExport(filename: string, format: string): void {
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'export_resume', {
        format,
        filename,
      })
    }
  }
}

export class PrintHelper {
  static print(element: HTMLElement): void {
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('请允许弹出窗口以打印简历')
      return
    }
    
    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n')
        } catch {
          return ''
        }
      })
      .join('\n')
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>打印简历</title>
          <style>
            ${styles}
            @media print {
              body { margin: 0; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          ${element.outerHTML}
        </body>
      </html>
    `)
    
    printWindow.document.close()
    printWindow.focus()
    
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }
}
