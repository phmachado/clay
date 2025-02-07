/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import ClayForm from '@clayui/form';
import React, {useState} from 'react';

import ClayColorPicker from '../src';

export default {
	component: ClayColorPicker,
	title: 'Design System/Components/ColorPicker',
};

export const Default = (args: any) => {
	const [color, setColor] = useState('FFFFFF');

	return (
		<ClayColorPicker
			disabled={args.disabled}
			label={args.label}
			name="colorPicker1"
			onValueChange={setColor}
			showHex={args.showHex}
			title={args.title}
			value={color}
		/>
	);
};

Default.args = {
	disabled: false,
	label: 'Default Colors',
	showHex: true,
	title: 'Default',
};

export const CustomColors = (args: any) => {
	const [customColors, setCustoms] = useState([
		'008000',
		'00FFFF',
		'0000FF',
		'blue',
		'black',
		'var(--blue)',
	]);

	const [color, setColor] = useState(customColors[0]);

	return (
		<ClayColorPicker
			colors={customColors}
			disabled={args.disabled}
			label={args.label}
			name="colorPicker2"
			onColorsChange={setCustoms}
			onValueChange={setColor}
			showHex={args.showHex}
			title={args.title}
			value={color}
		/>
	);
};

CustomColors.args = {
	disabled: false,
	label: 'Custom Colors',
	showHex: true,
	title: 'Default',
};

export const CustomAndPredefinedColors = (args: any) => {
	const [customColors, setCustoms] = useState([
		'008000',
		'00FFFF',
		'0000FF',
		'blue',
		'black',
		'var(--blue)',
	]);

	const [color, setColor] = useState(customColors[0]);

	return (
		<ClayColorPicker
			colors={customColors}
			disabled={args.disabled}
			label={args.label}
			name="colorPicker2"
			onColorsChange={setCustoms}
			onValueChange={setColor}
			showHex
			showPredefinedColorsWithCustom
			title={args.title}
			value={color}
		/>
	);
};

CustomAndPredefinedColors.args = {
	disabled: false,
	label: 'Custom Colors',
	title: 'Default',
};

export const CustomPalette = (args: any) => {
	const [customColors, setCustoms] = useState([
		'008000',
		'00FFFF',
		'0000FF',
		'blue',
		'black',
		'var(--blue)',
	]);

	const [color, setColor] = useState(customColors[0]);

	return (
		<ClayColorPicker
			colors={customColors}
			disabled={args.disabled}
			label={args.label}
			name="colorPicker2"
			onColorsChange={setCustoms}
			onValueChange={setColor}
			showHex={args.showHex}
			showPalette={false}
			title={args.title}
			value={color}
		/>
	);
};

CustomPalette.args = {
	disabled: false,
	label: '',
	showHex: true,
	title: 'Default',
};

export const Native = (args: any) => {
	const [color, setColor] = React.useState('FFFFFF');

	return (
		<ClayColorPicker
			disabled={args.disabled}
			label={args.label}
			onValueChange={setColor}
			showHex={args.showHex}
			title={args.title}
			useNative
			value={color}
		/>
	);
};

Native.args = {
	disabled: false,
	label: 'Default Colors',
	showHex: true,
	title: 'Default',
};

export const Small = (args: any) => {
	const [color, setColor] = React.useState('FFFFFF');

	return (
		<ClayColorPicker
			disabled={args.disabled}
			label={args.label}
			onValueChange={setColor}
			showHex={args.showHex}
			small
			title={args.title}
			value={color}
		/>
	);
};

Small.args = {
	disabled: false,
	label: 'Default Colors',
	showHex: true,
	title: 'Default',
};

export const Validation = () => {
	const [color, setColor] = useState('');

	const valid = color.length === 6;

	return (
		<ClayForm.Group className={!valid ? 'has-error' : ''}>
			<ClayColorPicker onValueChange={setColor} value={color} />

			{!valid && (
				<ClayForm.FeedbackGroup>
					<ClayForm.FeedbackItem>
						<ClayForm.FeedbackIndicator symbol="exclamation-full" />
						Input must be 6 letters long
					</ClayForm.FeedbackItem>
				</ClayForm.FeedbackGroup>
			)}
		</ClayForm.Group>
	);
};
