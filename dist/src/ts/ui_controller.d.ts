export declare class UI {
    static renderBoard(board: HTMLDivElement, cells?: string[][] | null, isAI?: boolean): void;
    static renderPlayerTwoBoard(): void;
    static createCentralDiv(): DocumentFragment;
    static reduceShipCount(name: string, newCount: number): void;
    static increaseShipCount(name: string, size: number, newCount: number): void;
    static showGameStartBtn(): void;
    static toggleShipBtns(): void;
    static toDualBoardView(): void;
    static disablePlacementMode(): void;
    static clearMain(): void;
    static switchCurrentPlayerIndicator(currentIsAI: boolean): void;
    static disableAllButtons(isDisabled: boolean): void;
    static addClasses(els: Element[], ...classes: string[]): void;
    static removeClasses(els: Element[], ...classes: string[]): void;
}
