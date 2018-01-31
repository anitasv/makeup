
function concealer(cons) {

    function argsArray(args) {
        return Array.prototype.slice.call(args)
    }

    function isPrivate(prop) {
        return typeof(prop) == 'string' && prop.startsWith('_')
    }

    function trapPrivate(prop, closure, action, ret) {
        var proto = closure[prop]
        if (isPrivate(prop)) {
            console.error(prop, 'is private')
            return ret
        } else {
            return action(proto)
        }
    }

    function shouldForward(prop) {
        if (prop == 'hasOwnProperty') {
            return false
        } else {
            return true
        }
    } 

    function ProxyCons() {
        const initial = {}
        const closure = cons.apply(initial, argsArray(arguments)) || initial
        Object.setPrototypeOf(closure, cons.prototype)

        const p = new Proxy(closure, {
            get(target, prop) {
                if (shouldForward(prop)) {
                    return trapPrivate(prop, target, function(proto) {
                        if (typeof (proto) == 'function') {
                            return proto.bind(target)
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
                    return trapPrivate(prop, target,  function(proto) {
                        target[prop] = value
                    })
                } else {
                    return Reflect.set(target, prop)
                }
            },
            has(target, prop) {
                if (!isPrivate()) {
                    return Reflect.has(target, prop)
                } else {
                    return false
                }
            },
            ownKeys(target) {
                return Object.keys(target).filter((x) => !isPrivate(x))
            },
            getOwnPropertyDescriptor(target, prop) {
                if (!isPrivate(prop)) {
                    return Reflect.getOwnPropertyDescriptor(target, prop);
                }
            },
            deleteProperty(target, prop) {
                return trapPrivate(prop, function(proto) {
                    return Reflect.deleteProperty(target, prop)
                })
            }
        });

        return p;
    }

    return ProxyCons;
}
