
function concealer(cons) {

    function argsArray(args) {
        return Array.prototype.slice.call(args)
    }

    function handleFunction(closure, proto) {
        return function() {
            return proto.apply(closure, argsArray(arguments))
        }
    }

    var newCons = function() {
        var closure = {}
        cons.apply(closure, argsArray(arguments));
        Object.setPrototypeOf(closure, cons.prototype)

        var p = new Proxy(closure, {
            get: function(target, prop) {
                if (prop.startsWith('_')) {
                    if (typeof(closure[prop]) == 'function') {
                        console.error('Tried to get private method', prop)
                    } else {
                        console.error('Tried to get private field', prop)
                    }
                    return
                } else {
                    var proto = closure[prop]
                    if (typeof(proto) == 'function') {
                        return handleFunction(closure, proto)
                    } else {
                        return proto
                    }
                }
            },
            set: function(target, prop, value) {
                if (prop.startsWith('_')) {
                    if (typeof(closure[prop]) == 'function') {
                        console.error('Tried to override private method', prop)
                    } else {
                        console.error('Tried to set private field', prop)
                    }                    
                    return
                } else {
                    closure[prop] = value
                }
            },
        });

        return p;
    }


    return newCons;
}