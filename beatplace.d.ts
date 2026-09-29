export interface Beat {
  id: string; title: string; producerId?: string; producerName?: string;
  genre?: string; bpm?: number; key?: string; price: number; premiumPrice?: number;
  plays?: number; artworkUrl?: string; previewUrl?: string;
}
export interface CheckoutRequest {beatId:string; license:'basic'|'premium'; currency:'USD'}
export interface PublishDraft {title:string; producerName:string; genre:string; bpm:number; key:string; price:number; audio:File}
export declare class BeatPlace extends HTMLElement {
  beats: Beat[];
  purchasedIds: string[];
  onCheckout?: (request:CheckoutRequest)=>Promise<unknown>;
  onPublish?: (draft:PublishDraft)=>Promise<Beat>;
  destroy():void;
}
declare global { interface HTMLElementTagNameMap {'beat-place':BeatPlace} }
