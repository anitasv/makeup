# makeup
A set of small libraries to make your javascript better. Performance may not be great yet, working on it.

## Concealer
Helps you hide your private fields and methods.

your normal life:
```javascript
function Animal(sound, breed) {
    this._sound = sound
    this.breed = breed
}

Animal.prototype._greeting = function() {
    return this.breed + ' says ';
}

Animal.prototype.talk = function() {
    return this._greeting() + this._sound
}

```

But normally private fields are only by convention of underscore, but you can enforce by:

```
Animal = concealer(Animal)

var a = new Animal('bark', 'dog')
```

```
> a._sound
err: Tried to get private field _sound
> a._greeting
err: Tried to get private method _greeting
> a._sound = 'meow'
err: Tried to set private field _sound
> a.talk()
"dog says bark"
> a.breed = 'cat'
> a.talk()
"cat says bark"

```

### Known Issues
1. delete pass through
2. performace may be slow.
