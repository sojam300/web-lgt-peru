import moment from 'moment';
import * as momentz from 'moment-timezone';
import { QueryParamsBuscarCajas } from '../interfaces/caja';
import { HttpParams } from '@angular/common/http';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
export const formatNumber = (number: string) => {
  const numberWithoutCommas = number.toString().replace(/,/g, '');
  console.log(numberWithoutCommas, 'numberWithoutCommas');
  return parseFloat(parseFloat(numberWithoutCommas).toFixed(2)).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
export const formatNumberToString = (number: number) => {
  return parseFloat(parseFloat(number.toString()).toFixed(2)).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
export const revertFormatNumber = (formattedNumber: string): number => {
  const numberWithoutCommas = formattedNumber.toString().replace(/,/g, '');
  const number = parseFloat(parseFloat(numberWithoutCommas).toFixed(2));
  return number;
};
export const formatFecha = (dateString: string) => {
  return moment(dateString).format('YYYY-MM-DD');
};
export const formatFechaNull = (dateString: string | null) => {
  let fecha = null;
  if (moment(dateString).isValid() && dateString) {
    fecha = momentz.tz(dateString, 'America/Lima').format('YYYY-MM-DD');
  }
  return fecha;
};
export const setQueryParams = (query: QueryParamsBuscarCajas): HttpParams => {
  let params = new HttpParams();
  for (const key in query) {
    if (query.hasOwnProperty(key)) {
      const value = query[key as keyof QueryParamsBuscarCajas];
      if (typeof value === 'string' || typeof value === 'number') {
        params = params.append(key, String(value));
      }
    }
  }
  return params;
};

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
