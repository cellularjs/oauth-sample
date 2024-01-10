import { ErrorItem } from '$share/types';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Injectable, addProxy, ProxyContext } from '@cellularjs/di';
import { IRQ } from '@cellularjs/net';
import { Unprocessable } from '$share/msg';

type DataGetter = (irq: IRQ) => any;

export const ValidateReq = (dataGetter?: DataGetter) => (aClass) => {
  addProxy(aClass, { proxy: ValidateReqProxy, meta: { dataGetter } });

  Injectable()(aClass);

  return aClass;
};

@Injectable()
class ValidateReqProxy {
  constructor(
    private irq: IRQ,
    private ctx: ProxyContext<{ dataGetter?: DataGetter }>,
  ) { }

  async handle() {
    const { irq, ctx } = this;
    const data = ctx.meta.dataGetter ? ctx.meta.dataGetter(irq) : irq.body;
    const dto = plainToInstance(ctx.token, data);
    const errs = await validate(dto, { stopAtFirstError: true });

    if (!errs.length) {
      return dto;
    }

    const errors: ErrorItem[] = errs.map(err => {
      const errKey = Object.keys(err.constraints)[0];

      return ({
        src: err.property,
        err: errKey,
        msg: err.constraints[errKey],
      });
    });

    throw Unprocessable({ errors });
  }
}
