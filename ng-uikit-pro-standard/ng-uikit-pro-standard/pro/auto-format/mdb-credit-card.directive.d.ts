export interface CreditCard {
    name: string;
    fullName: string;
    re: RegExp;
    pattern: RegExp;
    maxLength: number;
    cvvLength: number;
}
export declare class MdbCreditCardDirective {
    private standardPattern;
    cardName: string;
    cardFullName: string;
    private defaultCard;
    private cards;
    additionalCards: CreditCard[];
    private _additionalCards;
    separator: string;
    private _separator;
    constructor();
    maxLength: string;
    onInput(event: any): void;
    private formatInput(event);
    private getFormattedInput(value);
    private removeNonDigits(value);
    private hasStandardPattern(card);
    private isMatch(match);
    private updateCurrentCardNames(name, fullName);
    private findCardByNumber(value);
    addCards(newCards: CreditCard[]): void;
}
