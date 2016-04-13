import Node from '../Node.js';

export default class ReturnStatement extends Node {
	initialise () {
		this.loop = this.findNearest( /(?:For|While)Statement/ );
		this.nearestFunction = this.findNearest( /Function/ );

		if ( this.loop && ( !this.nearestFunction || this.loop.depth > this.nearestFunction.depth ) ) {
			this.loop.canReturn = true;
			this.shouldWrap = true;
		}

		if ( this.argument ) this.argument.initialise();
	}

	transpile ( code ) {
		if ( this.argument ) {
			const shouldWrap = this.shouldWrap && this.loop && this.loop.shouldRewriteAsFunction;
			if ( shouldWrap ) code.insert( this.argument.start, `{ v: ` );

			if ( this.argument ) this.argument.transpile( code );

			if ( shouldWrap ) code.insert( this.argument.end, ` }` );
		}
	}
}