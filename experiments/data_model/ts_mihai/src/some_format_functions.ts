import {IPlaceholder} from './imessageformat';
import {IPlaceholderFormatter, ISelectorFn} from './imessageformat';
import {mapToObject} from './util_functions';

export const formatDateTime: IPlaceholderFormatter = (
		ph: IPlaceholder,
		locale: string,
		parameters: Map<string, unknown>) => {

	const options = mapToObject<string>(ph.options);
	if (ph.formatter_name == 'date' || ph.formatter_name == 'time') {
		const value = parameters.get(ph.name);
		if (value instanceof Date) {
			return Intl.DateTimeFormat(locale, options).format(value);
		}
		if (value instanceof Number) {
			return Intl.DateTimeFormat(locale, options).format(value.valueOf());
		}
	}
	return '<undefined ' + ph.name + '>';
};

export const formatNumber: IPlaceholderFormatter = (
		ph: IPlaceholder,
		locale: string,
		parameters: Map<string, unknown>) => {

	const options = mapToObject<string>(ph.options);
	if (ph.formatter_name == 'number') {
		const value = parameters.get(ph.name);
		if (value instanceof Number || typeof value === 'number') {
			return Intl.NumberFormat(locale, options).format(value.valueOf());
		}
	}
	return '<undefined ' + ph.name + '>';
};

export const pluralSelector: ISelectorFn = (
		value1: unknown, value2: unknown, locale: string) => {
	if (value1 == value2) {
		return 15;
	}
	const value2Str = String(value2);
	if (String(value1) == value2Str) {
		return 10;
	}
	if (value1 instanceof Number || typeof value1 === 'number') {
		if (value2Str == new Intl.PluralRules(locale).select(value1.valueOf())) {
			return 5;
		}
	}
	if (value2Str == 'other') {
		return 2;
	}
	return -100000;
};

export const genderSelector: ISelectorFn = (
		value1: unknown, value2: unknown, locale: string) => {
	// the gender selector is just syntactic sugar, for now
	return genericSelector(value1, value2, locale);
};

export const genericSelector: ISelectorFn = (
		value1: unknown, value2: unknown,
		locale: string) => { // eslint-disable-line @typescript-eslint/no-unused-vars
	if (value1 == value2) {
		return 10;
	}
	const value2Str = String(value2);
	if (String(value1) == value2Str) {
		return 5;
	}
	if (value2Str == 'other') {
		return 2;
	}
	return -100000;
};
