export function associate( tree, op ) {

    if(!Array.isArray(tree))
	return tree;

    var operator = tree[0];
    var operands = tree.slice(1);

    operands = operands.map( function(v,i) {
	return associate(v, op); } );
    
    if (operator == op) {
	var result = [];
	
	for( var i=0; i<operands.length; i++ ) {
	    if (Array.isArray(operands[i]) && (operands[i][0] === op)) {
		result = result.concat( operands[i].slice(1) );
	    } else {
		result.push( operands[i] );
	    }
	}
	
	operands = result;
    }
    
    return [operator].concat( operands );
};

export function deassociate( tree, op ) {

    if(!Array.isArray(tree))
	return tree;
    
    var operator = tree[0];
    var operands = tree.slice(1);

    operands = operands.map( function(v,i) {
	return deassociate(v, op); } );
    
    if (operator == op) {
	var result = [op, operands[0], undefined];
	var next = result;
	
	for( var i=1; i<operands.length - 1; i++ ) {
	    next[2] = [op, operands[i], undefined];
	    next = next[2];
	}

	next[2] = operands[operands.length - 1];
	
	return result;
    }
    
    return [operator].concat( operands );
};


export function associate_all(tree) {
    tree = associate( tree, '+' );
    tree = associate( tree, '*' );
    tree = associate( tree, 'and' );
    tree = associate( tree, 'or' );
    tree = associate( tree, 'union' );
    tree = associate( tree, 'intersect' );
    return tree;
}

export function deassociate_all(tree) {
    tree = deassociate( tree, '+' );
    tree = deassociate( tree, '*' );
    tree = deassociate( tree, 'and' );
    tree = deassociate( tree, 'or' );
    tree = deassociate( tree, 'union' );
    tree = deassociate( tree, 'intersect' );
    return tree;
}
