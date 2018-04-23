
declare class Bridge{
	enabled:boolean;
	call(method:string, ...params);

	static getInstance():Bridge;
}