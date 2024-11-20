export type OptionsPublic = {
    imageKey: string,
    musicKey: string,
};

export type Options = OptionsPublic & {
    id: number,
};

export namespace OptionsPublic {
    export const Default: OptionsPublic = {
        imageKey: "",
        musicKey: "",
    };
}

export namespace Options {
    export const Default: Options = {
        ...OptionsPublic.Default,
        id: -1,
    };
}
