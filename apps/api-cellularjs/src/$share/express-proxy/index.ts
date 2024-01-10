import { IRQ, ToTargetHeader, send } from '@cellularjs/net';
import { expressProxy, InputTransform, OutputTransform } from '@cellularjs/express-proxy';
import { getLogger } from '@cellularjs/logger';
import * as multer from 'multer';
import { NextFunction, Request } from 'express';

const upload = multer();

export const proxyTo = (proxyTo: ToTargetHeader, subProxy?: any) => expressProxy(
  { inputTransform, outputTransform },
  { send },
)(proxyTo, subProxy);


export const multerSingleProxyTo = (inputFile: string, to: ToTargetHeader, subProxy?: any) => [
  upload.single(inputFile),
  (req: Request, _, next: NextFunction) => {
    req.body[inputFile] = req.file;
    next();
  },
  proxyTo(to, subProxy),
];

const inputTransform: InputTransform = (req, proxyTo) => {
  const logger = getLogger('ExpressProxy');

  const irq = new IRQ(
    { to: proxyTo, authorization: req.headers.authorization },
    { ...req.query, ...req.params, ...req.body },
  );

  logger.info(`${req.method} ${req.originalUrl} => ${proxyTo}`);
  logger.debug('received', { irq });

  return irq;
};

const outputTransform: OutputTransform = (expressCtx, cellularCtx) => {
  const { res } = expressCtx;
  const { irs } = cellularCtx;

  res
    .status(irs.header?.status || 500)
    .json(irs.body);
};
