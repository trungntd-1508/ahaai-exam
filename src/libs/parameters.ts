import _ from 'lodash';

const ParameterMissingError = function (message: string) {
  Error.captureStackTrace(this, this.contructor);
  this.name = this.constructor.name;
  this.message = message;
};

class Parameters<T> {
  public attrs: T | {};

  public params: { [key: string]: any };

  public filters: any[];

  constructor(attributes: undefined | T) {
    this.attrs = attributes || {};
    this.params = {};
    this.filters = [];
    if (attributes instanceof Array) {
      this.params = attributes.map(Parameters._initValue);
    } else {
      for (const key in attributes) {
        const value = attributes[key];
        this.params[key] = Parameters._initValue(value);
      }
    }
  }

  static readonly PRIMITIVE_TYPES = [Boolean, Number, String, function Null() { }];

  static _initValue(value: any) {
    return !Parameters._isPrimitive(value) ? new Parameters(value) : value;
  }

  static _isPrimitive(value: any) {
    return Parameters.PRIMITIVE_TYPES.some((Primitive) => [typeof value, String(value)].some((val) => val === Primitive.name.toLowerCase()));
  }

  static clone(value: any) {
    return value instanceof Parameters ? value.clone() : value;
  }

  static _cloneArray(params: any) {
    return params.map((param: any) => Parameters.clone(param));
  }

  static _cloneObject(params: any) {
    return _.transform(params, (result: { [key: string]: any }, value: any, key: string) => {
      result[key] = Parameters.clone(value);
    }, {});
  }

  public require(key: string) {
    const param = Parameters.clone(this._fetch(key));
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    if (!param) throw ParameterMissingError(`param ${key} required`);
    if (!(param instanceof Parameters)) throw new Error(`param ${key} is not a Parameters instance`);
    return param;
  }

  public permit(filters: any[]) {
    const clone = this.clone();
    clone.filters = filters || [];
    return clone;
  }

  public all() {
    return _.cloneDeep(this.attrs);
  }

  public value() {
    const clone = this.clone();
    const params: any = {};
    clone.filters.forEach((filter) => {
      if (typeof filter === 'object') {
        clone._permitObject(params, filter);
      } else {
        clone._permitPrimitive(params, filter);
      }
    });
    return params;
  }

  public clone() {
    const clone = _.cloneDeep(this);
    const parameters = new Parameters(undefined);
    parameters.attrs = _.cloneDeep(this.attrs);
    parameters.filters = _.cloneDeep(this.filters);
    parameters.params = (function () {
      if (_.isArray(clone.params)) {
        return Parameters._cloneArray(clone.params);
      } if (_.isObject(clone.params)) {
        return Parameters._cloneObject(clone.params);
      }
      throw new Error('Invalid parameter value');
    }());
    return parameters;
  }

  public _fetch(key: string) {
    return this.params[key];
  }

  public _hasKey(key: string) {
    return this._fetch(key) !== undefined;
  }

  public _permitPrimitive(params: { [key: string]: any }, key: string) {
    if (this._hasKey(key) && Parameters._isPrimitive(this._fetch(key))) {
      params[key] = this._fetch(key);
    }
  }

  public _permitObject(params: { [key: string]: any }, filters: any[]) {
    for (const key in filters) {
      let param: any;
      let isArrObj: boolean;
      const filtersArray = filters[key];
      if (_.isArray(filtersArray) && (param = this._fetch(key))) {
        if (Parameters._isPrimitive(param)) {
          continue;
        }
        if (_.isArray(param.params) || (isArrObj = Object.keys(param.params).every((i) => !_.isNaN(Number(i))))) {
          if (isArrObj) {
            params[key] = _.transform(param.params, (result: { [key: string]: any }, value, transformKey: string) => {
              result[transformKey] = Parameters._isPrimitive(value) ? value : value.permit(filtersArray).value();
            }, {});
          } else if (!param.params.some(Parameters._isPrimitive)) {
            params[key] = param.params.map((p: any) => p.permit(filtersArray).value());
          } else {
            params[key] = param.params.filter((p: any) => Parameters._isPrimitive(p));
          }
          continue;
        }
        if (filtersArray.length > 0 && param instanceof Parameters) {
          params[key] = param.permit(filtersArray).value();
          continue;
        }
      }
    }
  }
}

export default Parameters;
