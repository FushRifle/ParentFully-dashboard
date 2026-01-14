export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    PhoneVerify: undefined;
    TermsPrivacy: { page: 'terms' | 'privacy' };
};

export type BottomTabParamList = {
    Home: undefined;
    Resources: undefined;
    Rewards: undefined;
    Tools: undefined;
    Profile: undefined;
    Settings: undefined
    Curriculum: {
        selectedCategories: string[];
    };
};

export type DrawerParamList = {
    Main: undefined;
};

export type RootStackParamList = AuthStackParamList & {
    Main: undefined;
};