/**
 * SPDX-FileCopyrightText: © 2019 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {
	ClayPortal,
	IPortalBaseProps,
	doAlign,
	observeRect,
} from '@clayui/shared';
import classNames from 'classnames';
import React, {useCallback, useEffect, useRef, useState} from 'react';

export const ALIGN_POSITIONS = [
	'top',
	'top-left',
	'top-right',
	'bottom',
	'bottom-left',
	'bottom-right',
	'left',
	'left-top',
	'left-bottom',
	'right',
	'right-top',
	'right-bottom',
] as const;

const ALIGNMENTS_MAP = {
	bottom: ['tc', 'bc'],
	'bottom-left': ['tl', 'bl'],
	'bottom-right': ['tr', 'br'],
	left: ['cr', 'cl'],
	'left-bottom': ['br', 'bl'],
	'left-top': ['tr', 'tl'],
	right: ['cl', 'cr'],
	'right-bottom': ['bl', 'br'],
	'right-top': ['tl', 'tr'],
	top: ['bc', 'tc'],
	'top-left': ['bl', 'tl'],
	'top-right': ['br', 'tr'],
} as const;

type Point = typeof ALIGNMENTS_MAP[keyof typeof ALIGNMENTS_MAP];

const BOTTOM_OFFSET = [0, 4] as const;
const LEFT_OFFSET = [-4, 0] as const;
const RIGHT_OFFSET = [4, 0] as const;
const TOP_OFFSET = [0, -4] as const;

const OFFSET_MAP = {
	bctc: TOP_OFFSET,
	blbr: RIGHT_OFFSET,
	bltl: TOP_OFFSET,
	brbl: LEFT_OFFSET,
	brtr: TOP_OFFSET,
	clcr: RIGHT_OFFSET,
	crcl: LEFT_OFFSET,
	tcbc: BOTTOM_OFFSET,
	tlbl: BOTTOM_OFFSET,
	tltr: RIGHT_OFFSET,
	trbr: BOTTOM_OFFSET,
	trtl: LEFT_OFFSET,
};

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Position in which the tooltip will be aligned to the element.
	 */
	alignPosition?: typeof ALIGN_POSITIONS[number];

	/**
	 * Flag to indicate if the popover should be closed when
	 * clicking outside, only works if used with trigger
	 */
	closeOnClickOutside?: boolean;

	/**
	 * Props to add to the <ClayPortal/>.
	 */
	containerProps?: IPortalBaseProps;

	/**
	 * Flag to indicate if container should not be scrollable
	 */
	disableScroll?: boolean;

	/**
	 * Appends the type to `popover-`
	 */
	displayType?: string;

	/**
	 * Flag to indicate if tooltip is displayed.
	 */
	show?: boolean;

	/**
	 * Callback for setting the offset of the popover from the trigger.
	 */
	onOffset?: (points: Point) => [number, number];

	/**
	 * Callback for when the `show` prop changes.
	 */
	onShowChange?: (val: boolean) => void;

	/**
	 * Sets the size of the popover.
	 */
	size?: 'lg';

	/**
	 * React element that the popover will align to when clicked.
	 */
	trigger?: React.ReactElement &
		Omit<React.RefAttributes<HTMLButtonElement>, 'key'>;

	/**
	 * Content to display in the header of the popover.
	 */
	header?: React.ReactNode;
}

const ClayPopover = React.forwardRef<HTMLDivElement, IProps>(
	(
		{
			alignPosition = 'bottom',
			children,
			className,
			closeOnClickOutside = false,
			containerProps = {},
			disableScroll = false,
			displayType,
			header,
			onOffset = (points) =>
				OFFSET_MAP[points.join('') as keyof typeof OFFSET_MAP] as [
					number,
					number
				],
			onShowChange,
			show: externalShow = false,
			size,
			trigger,
			...otherProps
		}: IProps,
		ref
	) => {
		const [internalShow, internalSetShow] = useState(externalShow);

		const triggerRef = useRef<HTMLElement | null>(null);
		const popoverRef = useRef<HTMLElement | null>(null);
		const popoverScrollerRef = useRef<HTMLDivElement | null>(null);

		if (!ref) {
			ref = popoverRef as React.Ref<HTMLDivElement>;
		}

		const show =
			typeof externalShow === 'boolean' ? externalShow : internalShow;
		const setShow = onShowChange ? onShowChange : internalSetShow;

		const align = useCallback(() => {
			if (
				(ref as React.RefObject<HTMLElement>).current &&
				triggerRef.current
			) {
				const points = ALIGNMENTS_MAP[alignPosition];

				doAlign({
					offset: onOffset(points),
					points,
					sourceElement: (ref as React.RefObject<HTMLElement>)
						.current!,
					targetElement: triggerRef.current as HTMLElement,
				});
			}
		}, [alignPosition, triggerRef, ref]);

		useEffect(() => {
			if (trigger) {
				align();
			}
		}, [align, show]);

		useEffect(() => {
			if (trigger && triggerRef.current) {
				return observeRect(triggerRef.current, align);
			}
		}, [align]);

		useEffect(() => {
			if (!disableScroll && popoverScrollerRef.current && show) {
				popoverScrollerRef.current.focus();
			}
		}, [disableScroll, popoverScrollerRef, show]);

		useEffect(() => {
			if (closeOnClickOutside && trigger) {
				const handleClick = (event: MouseEvent) => {
					const nodeRefs = [
						popoverRef,
						popoverScrollerRef,
						triggerRef,
					];

					const nodes: Array<Node> = (
						Array.isArray(nodeRefs) ? nodeRefs : [nodeRefs]
					)
						.filter((ref) => ref.current)
						.map((ref) => ref.current!);

					if (
						event.target instanceof Node &&
						!nodes.find((element) =>
							element.contains(event.target as Node)
						)
					) {
						setShow(false);
					}
				};

				window.addEventListener('mousedown', handleClick);

				return () => {
					window.removeEventListener('mousedown', handleClick);
				};
			}
		}, [closeOnClickOutside, trigger]);

		useEffect(() => {
			const handleKeyDown = (event: KeyboardEvent) => {
				if (event.key === 'Escape') {
					setShow(false);
				}
			};

			window.addEventListener('keydown', handleKeyDown);

			return () => {
				window.removeEventListener('keydown', handleKeyDown);
			};
		}, []);

		let content = (
			<div
				className={classNames(
					className,
					'popover',
					`clay-popover-${alignPosition}`,
					{
						[`popover-${displayType}`]: displayType,
						'popover-width-lg': size === 'lg',
						show,
					}
				)}
				ref={ref as React.RefObject<HTMLDivElement>}
				{...otherProps}
			>
				<div className="arrow" />

				<div
					className={classNames({
						'inline-scroller': !disableScroll,
					})}
					ref={popoverScrollerRef}
					tabIndex={!disableScroll ? -1 : undefined}
				>
					{header && <div className="popover-header">{header}</div>}

					<div className="popover-body">{children}</div>
				</div>
			</div>
		);

		if (trigger) {
			content = (
				<>
					{React.cloneElement(trigger, {
						onClick: (event: any) => {
							if (trigger.props.onClick) {
								trigger.props.onClick(event);
							}
							setShow(!show);
						},
						ref: (node: HTMLButtonElement) => {
							if (node) {
								triggerRef.current = node;
								// Call the original ref, if any.
								const {ref} = trigger;
								if (typeof ref === 'function') {
									ref(node);
								} else if (ref) {
									(
										ref as React.MutableRefObject<HTMLButtonElement>
									).current = node;
								}
							}
						},
					})}

					{show && (
						<ClayPortal {...containerProps}>{content}</ClayPortal>
					)}
				</>
			);
		}

		return content;
	}
);

ClayPopover.displayName = 'ClayPopover';

export default ClayPopover;
