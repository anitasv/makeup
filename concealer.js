
function concealer(cons) {

    function argsArray(args) {
        return Array.prototype.slice.call(args)
    }

    function isPrivate(prop) {
        return typeof(prop) == 'string' && prop.startsWith('_')
    }

    function trapPrivate(prop, closure, action, ret) {
        var proto = closure[prop]
        var protoType = typeof(proto)
        if (isPrivate(prop)) {
            if (protoType == 'function') {
                console.error('Tried to get private method', prop)
            } else {
                console.error('Tried to get private field', prop)
            }
            return ret
        } else {
            return action(proto, protoType)
        }
    }

    function shouldForward(prop) {
        if (prop == 'hasOwnProperty') {
            return false
        } else {
            return true
        }
    } 

    const newCons = function() {
        const initial = {}
        const closure = cons.apply(initial, argsArray(arguments)) || initial
        Object.setPrototypeOf(closure, cons.prototype)

        const p = new Proxy(closure, {
            get(target, prop) {
                if (shouldForward(prop)) {
                    return trapPrivate(prop, closure, function(proto, protoType) {
                        if (protoType == 'function') {
                            return proto.bind(closure)
                        } else {
                            return proto
                        }
                    })
                } else {
                    return Reflect.get(target, prop)
                }
            },
            set(target, prop, value) {
                if (shouldForward(prop)) {
                    return trapPrivate(prop, closure,  function(proto, protoType) {
                        closure[prop] = value
                    })
                } else {
                    return Reflect.set(target, prop)
                }
            },
            has(target, prop) {
                if (!isPrivate()) {
                    return Reflect.has(closure, prop)
                } else {
                    return false
                }
            },
            ownKeys(target) {
                return Object.keys(closure).filter((x) => !isPrivate(x))
            },
            getOwnPropertyDescriptor(target, prop) {
                if (!isPrivate(prop)) {
                  return Reflect.getOwnPropertyDescriptor(closure, prop);
                }
            }
        });

        return p;
    }


    return newCons;
}
