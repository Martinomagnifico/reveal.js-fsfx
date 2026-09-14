export declare enum SectionType {
    HORIZONTAL = "horizontal",// Standalone section
    STACK = "stack",// Has section children (it is a vertical stack)
    VERTICAL = "vertical",// Is a child of a stack (a vertical slide)
    INVALID = "invalid"
}
export declare const isSection: (element: HTMLElement | null) => boolean;
export declare const isStack: (element: HTMLElement) => boolean;
export declare const isVertical: (element: HTMLElement) => boolean;
export declare const isHorizontal: (element: HTMLElement) => boolean;
export declare const getStack: (element: HTMLElement) => HTMLElement | null;
export declare const getSectionType: (element: HTMLElement) => SectionType;
