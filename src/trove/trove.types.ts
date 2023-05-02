export type TroveDomainType = 'ens' | 'smol' | 'treasuretag' | 'address';

export interface TroveDomainInfo {
    name: string;
    pfp: string | null;
    banner: string | null;
}

export interface TroveSocialInfo {
    id: string;
    name: string;
}

export interface TroveAccountDomains {
    address: string;
    ens?: TroveDomainInfo;
    smol?: TroveDomainInfo;
    treasuretag?: TroveDomainInfo;
    preferredDomainType?: TroveDomainType;
    discord?: TroveSocialInfo;
    twitter?: TroveSocialInfo;
}
