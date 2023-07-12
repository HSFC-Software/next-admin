import { Obj } from '@/types';
import {
  UNSAFE_registerProperty,
  UNSAFE_registerMethod,
  UNSAFE_retrieveProperty,
  UNSAFE_run,
  UNSAFE_removeProperty,
} from './index';

describe('Register Property', () => {
  test('Warning should be prompt when overwriting existing property', () => {
    const logSpy = jest.spyOn(console, 'warn');

    (global as Obj).__EXISTING_PROPERTY__ = true;
    UNSAFE_registerProperty('__EXISTING_PROPERTY__', true);
    expect(logSpy).toHaveBeenCalled();
  });

  test('It should insert new property to the global object', () => {
    const newPropertyValue = '2023';
    UNSAFE_registerProperty('__YEAR__', newPropertyValue);
    expect((global as Obj)?.__YEAR__).toBe(newPropertyValue);
  });
});

describe('Register Method', () => {
  test('Warning should be prompt when overwriting existing method', () => {
    const logSpy = jest.spyOn(console, 'warn');

    (global as Obj).__EXISTING_METHOD__ = () => {};
    UNSAFE_registerMethod('__EXISTING_METHOD__', () => {});
    expect(logSpy).toHaveBeenCalled();
  });

  test('It should insert new method to the global object', () => {
    expect((global as Obj).__TEST_METHOD__).toBeUndefined();
    UNSAFE_registerMethod('__TEST_METHOD__', () => {});
    expect((global as Obj).__TEST_METHOD__).toBeDefined();
  });
});

describe('Retrieve Property', () => {
  test('Should retrieve previously registered property', () => {
    expect((global as Obj).__EXISTING__).toBeUndefined();

    UNSAFE_registerProperty('__EXISTING__', true);

    expect(UNSAFE_retrieveProperty('__EXISTING__')).toBeDefined();
  });
});

const mockMethod = jest.fn();

describe('Run Method', () => {
  test('Should run previously registered method', () => {
    expect((global as Obj).__HANDLER__).toBeUndefined();

    UNSAFE_registerMethod('__HANDLER__', mockMethod);
    UNSAFE_run('__HANDLER__');

    expect(mockMethod).toHaveBeenCalled();
  });
});

describe('Remove property', () => {
  test('Should remove property', () => {
    UNSAFE_registerProperty('__EXISTING_PROPERTY_', true);
    expect(UNSAFE_retrieveProperty('__EXISTING_PROPERTY_')).toBe(true);

    UNSAFE_removeProperty('__EXISTING_PROPERTY_');
    expect(UNSAFE_retrieveProperty('__EXISTING_PROPERTY_')).toBeUndefined();
  });
});
