import { Component, ElementRef, OnInit } from '@angular/core';
import { CajaService } from '../../services/caja.service';
import { LiquidacionService } from '../../services/liquidacion.service';
import { Liquidacion, LiquidacionValidacion } from '../../interfaces/liquidacion';
import { CatalogoEstadoService } from '../../services/catalogo-estado.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../services/error.service';
import { CatalogoEstado } from '../../interfaces/catalogo-estado';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProveedorService } from '../../services/proveedor.service';
import { Proveedor } from '../../interfaces/proveedor';
import { ComprobanteService } from '../../services/comprobante.service';
import { Comprobante } from '../../interfaces/comprobante';
import { formatFecha, formatNumber, formatNumberToString, revertFormatNumber } from '../../common/helpers';
import ImageCompressor from 'image-compressor.js';
import { Gastos, GastosGrupo } from '../../interfaces/gastos';
import { GastosService } from '../../services/gastos.service';
import * as bootstrap from 'bootstrap';
@Component({
  selector: 'app-modal-liquidacion',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './modal-liquidacion.component.html',
  styleUrl: './modal-liquidacion.component.css',
})
export class ModalLiquidacionComponent implements OnInit {
  myModalLiquidacion: any;
  id_caja_chica: string = '';
  se_actualizo_archivos: boolean = false;
  cajaDetalleFormVal = {
    // id_tipo_detalle_requerimiento: false,
    fecha: false,
    id_comprobante: false,
    serie: false,
    numero: false,
    id_proveedor: false,
    id_moneda: false,
    total_format: false,
    id_gastos_n1: false,
    id_gastos_n2: false,
    id_gastos_n3: false,
  };
  caja_detalle_init: Liquidacion = {
    id: '',
    es_caja_chica: false,
    id_estado: null,
    estado: {
      nombre: '',
      valor: 0,
    },
    id_tipo: null,
    tipo: {
      nombre: '',
      valor: 0,
    },
    id_tipo_detalle_requerimiento: null,
    orden: 0,
    fecha: '',
    id_solicitud: null,
    id_requerimiento: null,
    id_caja: null,
    caja: {
      codigo: '',
    },
    id_comprobante: '',
    comprobante: {
      nombre: '',
      abreviatura: '',
      es_igv: '',
    },
    serie: '',
    numero: '',
    id_proveedor: '',
    proveedor: {
      ruc: '',
      razon_social: '',
      direccion: '',
    },
    id_moneda: '',
    moneda: {
      nombre: '',
      valor: 0,
    },
    tipo_cambio: 0,
    tipo_cambio_format: '0.00',
    total: 0,
    total_format: '',
    total_igv: 0,
    total_igv_format: '0.00',
    tasa_detraccion: 0,
    tasa_detraccion_format: '0.00',
    total_detraccion: 0,
    total_detraccion_format: '0.00',
    tasa_retencion: 0,
    tasa_retencion_format: '0.00',
    total_retencion: 0,
    total_retencion_format: '0.00',
    a_pagar: 0,
    a_pagar_format: '0.00',
    glosa: '',
    id_gastos_n1: '',
    gastos_n1: {
      nombre: '',
      nivel_grupo: 0,
    },
    id_gastos_n2: '',
    gastos_n2: {
      nombre: '',
      nivel_grupo: 0,
    },
    id_gastos_n3: '',
    gastos_n3: {
      nombre: '',
      nivel_grupo: 0,
    },

    id_usuario_creacion: '',
    usuario_creacion: { nombres: '', apellidos: '' },
    fecha_creacion: '',
    id_usuario_edicion: '',
    usuario_edicion: { nombres: '', apellidos: '' },
    fecha_edicion: '',
    archivos: [],
  };

  caja_detalle: Liquidacion = { ...this.caja_detalle_init };
  tiposReqDetalle: CatalogoEstado[] = [];
  proveedores: Proveedor[] = [];
  comprobantes: Comprobante[] = [];
  tiposMoneda: CatalogoEstado[] = [];
  grupo_gastos: Gastos[] = [];
  grupo_gastos2: GastosGrupo[] = [];
  grupo_gastos3: GastosGrupo[] = [];
  archivos: { contenido: any; tipo: string }[] = [];
  se_guardo_liquidacion = false;
  constructor(
    private _liquidacionService: LiquidacionService,
    private _catalogoEstadoService: CatalogoEstadoService,
    private _toastService: ToastService,
    private _proveedorService: ProveedorService,
    private _comprobanteService: ComprobanteService,
    private _gastosService: GastosService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.myModalLiquidacion = new bootstrap.Modal(this.elementRef.nativeElement.querySelector('#modalLiquidacion'));
    this.myModalLiquidacion._element.addEventListener('hide.bs.modal', () => {
      this.caja_detalle = this.caja_detalle_init;
    });

    this._gastosService.getAllGastosGrupo1().subscribe({
      next: (gastos) => {
        this.grupo_gastos = gastos;
      },
      error: (error: HttpErrorResponse) => {
        this._toastService.msgError(error);
      },
    });
    this._comprobanteService.getAll().subscribe({
      next: (comprobantes) => {
        this.comprobantes = comprobantes;
      },
      error: (error: HttpErrorResponse) => {
        this._toastService.msgError(error);
      },
    });

    this._catalogoEstadoService.getTiposMoneda().subscribe({
      next: (tiposMoneda) => {
        this.tiposMoneda = tiposMoneda;
      },
      error: (error: HttpErrorResponse) => {
        this._toastService.msgError(error);
      },
    });
    this.caja_detalle;
  }

  buscarProveedorePorRS() {
    if (!(this.caja_detalle.proveedor.razon_social.length > 0)) {
      return this._toastService.messageInfo('Ingrese texto.');
    }
    this._proveedorService.buscarPorRazonSocial(this.caja_detalle.proveedor.razon_social).subscribe({
      next: (proveedores) => {
        this.proveedores = proveedores;
        if (proveedores.length > 0) {
          this.proveedores = proveedores;
          this._toastService.messageAddOk('Busqueda completa.');
        } else {
          this._toastService.messageInfo('Busqueda sin resultados.');
        }
      },
      error: (error: HttpErrorResponse) => {
        this._toastService.msgError(error);
      },
    });
  }

  changeTipoDocumento(id_tipo_documento: string) {
    const findId = this.comprobantes.find((c) => c.id === id_tipo_documento);
    if (findId && findId.es_igv === true) {
      this.caja_detalle.total_igv = 18;
      this.caja_detalle.total_igv_format = formatNumberToString(18);
    } else {
      this.caja_detalle.total_igv = 0;
      this.caja_detalle.total_igv_format = formatNumberToString(0);
    }
  }
  changeGrupoGastoN1(id: string) {
    this._gastosService.getAllGastosGrupo2byGrupo1(id).subscribe({
      next: (gastos) => {
        this.grupo_gastos2 = gastos;
      },
      error: (error: HttpErrorResponse) => {
        this._toastService.msgError(error);
      },
    });
  }
  changeGrupoGastoN2(id: string) {
    this._gastosService.getAllGastosGrupo3byGrupo2(id).subscribe({
      next: (gastos) => {
        this.grupo_gastos3 = gastos;
      },
      error: (error: HttpErrorResponse) => {
        this._toastService.msgError(error);
      },
    });
  }
  mostrarContenidoDesdeBuffer(buffer: ArrayBuffer, fileName: string, fileType: string) {
    const uint8Array = new Uint8Array(buffer);
    let binaryString = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binaryString += String.fromCharCode(uint8Array[i]);
    }
    const base64String = btoa(binaryString);
    const dataURL = `data:${fileType};base64,${base64String}`;
    this.caja_detalle.archivos.push({ tipo: fileType, contenido: dataURL, name: fileName, formato: fileType });
  }
  descargarArchivoComoImagen(dataURL: string, fileName: string, fileType: string) {
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = fileName;
    link.type = fileType;
    link.click();
  }
  descargarImagen(dataUrl: string, fileType: string, fileName: string) {
    // let fileName; // Aquí va el nombre del archivo
    switch (fileType) {
      case 'application/pdf':
        // fileName = 'documento.pdf';
        break;
      case 'application/msword':
        // fileName = 'documento.doc';
        break;
      // Agrega más casos según sea necesario
      default:
      // fileName = 'archivo';
    }
    this.descargarArchivoComoImagen(dataUrl, fileName, fileType);
  }
  mostrarContenido(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.caja_detalle.archivos.push({
        tipo: file.type,
        contenido: e.target.result,
        name: file.name,
        formato: file.type,
      });
    };
    reader.readAsDataURL(file);
    this.caja_detalle.archivos;
    console.log(this.caja_detalle.archivos);
    // const reader = new FileReader();
    // reader.onload = (e: any) => {
    //   let tipoArchivo;
    //   if (file.type.startsWith('image')) {
    //     tipoArchivo = 'imagen';
    //   } else if (file.type === 'application/pdf') {
    //     tipoArchivo = 'pdf';
    //     // const pdfURL = this.sanitizer.bypassSecurityTrustResourceUrl(archivo.contenido);
    //     // archivo.urlSegura = pdfURL;
    //   } else if (
    //     file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    //     file.type === 'application/msword'
    //   ) {
    //     tipoArchivo = 'documento_word';
    //   } else if (
    //     file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    //     file.type === 'application/vnd.ms-excel'
    //   ) {
    //     tipoArchivo = 'documento_excel';
    //   } else if (
    //     file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
    //     file.type === 'application/vnd.ms-powerpoint'
    //   ) {
    //     tipoArchivo = 'documento_powerpoint';
    //   } else {
    //     // Tipo de archivo no reconocido
    //     console.error('Tipo de archivo no compatible:', file.type);
    //     return;
    //   }

    //   this.caja_detalle.archivos.push({
    //     tipo: tipoArchivo,
    //     contenido: e.target.result,
    //     name: file.name,
    //     formato: file.type,
    //   });
    // };
    // reader.readAsDataURL(file);
  }

  async comprimirImagen(file: File): Promise<File> {
    const options = {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 1,
      mimeType: 'image/jpeg',
    };
    const compressor = new ImageCompressor();
    const compressedBlob = await compressor.compress(file, options);
    const compressedFile = new File([compressedBlob], file.name, { type: 'image/jpeg' });
    return compressedFile;
  }

  async cargarArchivos(event: any) {
    this.caja_detalle.archivos = []; // Vaciar el arreglo de archivos anteriores
    this.se_actualizo_archivos = true;
    const files = event.target.files;
    if (files.length > 2) {
      alert('Selecciona máximo dos archivos.');
      return;
    }
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Validar el tipo de archivo permitido
      const esTipoPermitido = this.esTipoPermitido(file.type);
      file.name;
      // Validar el tipo de archivo
      const esImagen = file.type.startsWith('image');

      if (!esImagen && file.size > 3 * 1024 * 1024) {
        // Otros tipos de archivo mayores a 2 MB
        alert('El archivo ' + file.name + ' supera el tamaño máximo permitido (3 MB).');
      } else if (esTipoPermitido) {
        // 1 MB
        if (esImagen) {
          const compressedFile = await this.comprimirImagen(file);
          this.mostrarContenido(compressedFile);
        } else {
          this.mostrarContenido(file);
        }
      } else {
        alert('Tipo de archivo no permitido.');
      }
    }
  }
  esTipoPermitido(tipoArchivo: string): boolean {
    // Tipos MIME permitidos: imágenes, PDF, documentos de Office
    return tipoArchivo.startsWith('image') || tipoArchivo === 'application/pdf' || this.esDocumentoOffice(tipoArchivo);
  }
  esDocumentoOffice(tipoArchivo: string): boolean {
    return (
      tipoArchivo === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || // Word
      tipoArchivo === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || // Excel
      tipoArchivo === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ); // PowerPoint
  }
  formatearMontos(liquidacion: Liquidacion) {
    liquidacion.total = revertFormatNumber(liquidacion.total_format);
    return liquidacion;
  }
  validarInputLiquidacion(nombreInput: LiquidacionValidacion) {
    this.cajaDetalleFormVal[nombreInput] = !this.caja_detalle[nombreInput] ? true : false;
    nombreInput;
    this.cajaDetalleFormVal[nombreInput];
    return this.cajaDetalleFormVal[nombreInput];
  }
  validarFormularioLiquidacion() {
    let toastMsg = false;
    for (const key in this.cajaDetalleFormVal) {
      if (Object.prototype.hasOwnProperty.call(this.cajaDetalleFormVal, key)) {
        const valInput = this.validarInputLiquidacion(key as LiquidacionValidacion);
        if (toastMsg === false) toastMsg = valInput;
      }
    }

    return toastMsg;
  }
  guardar() {
    const isNotValidForm = this.validarFormularioLiquidacion();
    if (isNotValidForm === true) {
      this._toastService.messageInfo('Por favor completar los campos requeridos.');
      return;
    }
    this.se_guardo_liquidacion = true;
    this.caja_detalle = this.formatearMontos(this.caja_detalle);
    console.log(this.se_guardo_liquidacion, 'SE GUARDO LIQ EN LIQUI');
    console.log(this.caja_detalle, 'LIQUIDACION POR GUARDAR');
    if (this.caja_detalle.id && this.caja_detalle.id !== '') {
      this._liquidacionService.editarLiquidacion(this.caja_detalle, this.caja_detalle.id).subscribe({
        next: (liquidacion) => {
          this._toastService.messageAddOk('Se Edito liquidación correctamente.');
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
      if (this.se_actualizo_archivos === true) {
        this._liquidacionService.updateArchivos(this.caja_detalle, this.caja_detalle.id).subscribe({
          next: (archivos) => {
            this._toastService.messageAddOk('Se edito archivos correctamente.');
          },
          error: (error: HttpErrorResponse) => {
            this._toastService.msgError(error);
          },
        });
        this.se_actualizo_archivos = false;
      }
    } else {
      this._liquidacionService.crearLiquidacion(this.caja_detalle).subscribe({
        next: (liquidacion) => {
          this.caja_detalle.id = liquidacion.id;
          this._toastService.messageAddOk('Se guardo liquidación correctamente.');
        },
        error: (error: HttpErrorResponse) => {
          this._toastService.msgError(error);
        },
      });
    }
  }
  formatearLiquidacion(liquidacion: Liquidacion) {
    liquidacion.fecha = formatFecha(liquidacion.fecha);
    liquidacion.tipo_cambio_format = formatNumberToString(liquidacion.tipo_cambio);
    liquidacion.total_format = formatNumberToString(liquidacion.total);
    liquidacion.total_igv_format = formatNumberToString(liquidacion.total_igv);
    liquidacion.tasa_detraccion_format = formatNumberToString(liquidacion.tasa_detraccion);
    liquidacion.total_detraccion_format = formatNumberToString(liquidacion.total_detraccion);
    liquidacion.tasa_retencion_format = formatNumberToString(liquidacion.tasa_retencion);
    liquidacion.total_retencion_format = formatNumberToString(liquidacion.total_retencion);
    liquidacion.a_pagar_format = formatNumberToString(liquidacion.a_pagar);
    return liquidacion;
  }
  openModalCreate() {
    // if (this.requerimiento.id === '' || !this.requerimiento.id) {
    //   return this._toastService.messageInfo('Debe crear un requerimiento.');
    // }
    // this.caja_detalle.id_requerimiento = this.requerimiento.id;
    // this.id_caja_chica = this.requerimiento.id ?? '';
    // this.tiposReqDetalle = this.tiposReqDetalle;
    this.myModalLiquidacion.show();
  }
  openModalLiquidacionEdit(findLiquidacion: Liquidacion) {
    // let findLiquidacion = this.liquidaciones.find((liquidacion) => liquidacion.id === id);
    //  (findLiquidacion, 'findLiquidacion');

    if (findLiquidacion) {
      findLiquidacion = this.formatearLiquidacion(findLiquidacion);
      this.caja_detalle = { ...findLiquidacion, archivos: [] };
      this.grupo_gastos2.push({
        id: findLiquidacion.id_gastos_n1,
        gasto_hijo: {
          id: findLiquidacion.id_gastos_n2,
          nombre: findLiquidacion.gastos_n2.nombre,
          nivel_grupo: findLiquidacion.gastos_n2.nivel_grupo,
        },
      });
      this.grupo_gastos3.push({
        id: findLiquidacion.id_gastos_n2,
        gasto_hijo: {
          id: findLiquidacion.id_gastos_n3,
          nombre: findLiquidacion.gastos_n3.nombre,
          nivel_grupo: findLiquidacion.gastos_n3.nivel_grupo,
        },
      });
    }
    this._liquidacionService.findArchivos(findLiquidacion.id).subscribe({
      next: (archivos) => {
        console.log(archivos, 'ARCHIVOS LIQUIDACION');
        for (const archivo of archivos) {
          if (archivo.contenido.data) {
            this.mostrarContenidoDesdeBuffer(archivo.contenido.data, archivo.nombre_original, archivo.tipo);
          }
        }
      },
      error: (error: HttpErrorResponse) => {
        this._toastService.msgError(error);
      },
    });

    this.myModalLiquidacion.show();
  }
  changeTotal() {
    console.log('cambiando total', this.caja_detalle.total_format);
    this.caja_detalle.total = revertFormatNumber(this.caja_detalle.total_format);
    this.caja_detalle.total_igv = this.caja_detalle.total * 0.18;

    this.caja_detalle.total_igv_format = formatNumber(this.caja_detalle.total_igv.toString());
    this.caja_detalle.a_pagar = parseFloat((this.caja_detalle.total - this.caja_detalle.total_igv).toFixed(2));
    this.caja_detalle.a_pagar_format = formatNumber(this.caja_detalle.a_pagar.toString());
    console.log(this.caja_detalle.total_igv);
  }
}
