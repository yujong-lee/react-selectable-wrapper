/**
 * @jest-environment jsdom
 */

/* eslint-disable react/jsx-boolean-value */

import { fireEvent, render } from '@testing-library/react';

import Selectable from './selectable';

const TestElement = ({ testid, selected, onClick }) => (
  <button type="button" data-testid={testid} onClick={onClick}>
    {selected ? 'This is selected' : 'This is not selected'}
  </button>
);

const renderSelectable = () => render(
  <Selectable mode={given.mode} onClick={given.onClick}>
    <TestElement testid="1" selected={false} />
    <TestElement testid="2" selected={true} />
  </Selectable>,
);

describe('Selectable', () => {
  const onClick = jest.fn();

  beforeEach(() => {
    onClick.mockClear();
  });

  context('when "checkbox" is provided for mode', () => {
    given('mode', () => 'checkbox');

    it('makes each child selectable', () => {
      const { getByTestId } = renderSelectable();

      expect(getByTestId('1')).toHaveTextContent('This is not selected');
      expect(getByTestId('2')).toHaveTextContent('This is selected');

      fireEvent.click(getByTestId('2'));

      expect(getByTestId('1')).toHaveTextContent('This is not selected');
      expect(getByTestId('2')).toHaveTextContent('This is not selected');

      fireEvent.click(getByTestId('1'));

      expect(getByTestId('1')).toHaveTextContent('This is selected');
      expect(getByTestId('2')).toHaveTextContent('This is not selected');
    });

    context('when onClick is provided', () => {
      given('onClick', () => onClick);

      it('calls click handler with selected array', () => {
        const { getByTestId } = renderSelectable();

        fireEvent.click(getByTestId('1'));

        expect(onClick).toBeCalledWith([true, true]);
      });
    });
  });

  context('when "singleChoice" is provided for mode', () => {
    given('mode', () => 'singleChoice');

    it('allows one child to be selected', () => {
      const { getByTestId } = renderSelectable();

      expect(getByTestId('1')).toHaveTextContent('This is not selected');
      expect(getByTestId('2')).toHaveTextContent('This is selected');

      fireEvent.click(getByTestId('1'));

      expect(getByTestId('1')).toHaveTextContent('This is selected');
      expect(getByTestId('2')).toHaveTextContent('This is not selected');
    });

    context('when onClick is provided', () => {
      given('onClick', () => onClick);

      it('calls click handler with selected index', () => {
        const { getByTestId } = renderSelectable();

        fireEvent.click(getByTestId('1'));

        expect(onClick).toBeCalledWith(0);
      });
    });
  });
});
