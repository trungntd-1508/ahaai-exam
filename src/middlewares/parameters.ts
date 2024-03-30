import _ from 'lodash';
import Parameters from '../libs/parameters';

const strongParams = () => (req: any, res: any, next: any) => {
  let params: Parameters<typeof req.params>;
  Object.defineProperty(req, 'parameters', {
    get() {
      return params.clone();
    },
    set(o) {
      params = new Parameters(o);
    },
  });
  req.parameters = _.merge({}, req.body, req.query, req.params, req.fields);
  next();
};

export default strongParams;
