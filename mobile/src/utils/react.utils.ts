import React from 'react';

export const isFunction = (obj: any): obj is Function =>
  typeof obj === 'function';

export const isEmptyChildren = (children: any): boolean =>
  React.Children.count(children) === 0;
