
/**
 * @constructor
 */
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

Animal.prototype.argue = function(about) {
    return this.talk() + ' at the ' + about
}

Animal.prototype.name = 'Animal'

var SafeAnimal = concealer(Animal)

function eq(expected, actual) {
    if (expected == actual) {
        return
    } else {
        console.error('Expected: ', expected, 'Actual: ', actual);
    }
}

function test() {
    var a1 = new Animal('bark', 'dog')
    eq('Animal', a1.name)
    eq('dog says bark', a1.talk())
    eq('bark', a1._sound);
    eq('dog says ', a1._greeting());
    eq('dog says bark at the door', a1.argue('door'))

    var a2 = new Animal('bark', 'dog')
    a2._sound = 'meow'
    a2.breed = 'cat'
    eq('Animal', a2.name)
    eq('cat says meow', a2.talk())
    eq('meow', a2._sound);
    eq('cat says ', a2._greeting());
    eq('cat says meow at the door', a2.argue('door'))

    var b1 = new SafeAnimal('bark', 'dog')
    eq('Animal', b1.name)
    eq('dog says bark', b1.talk())
    eq(undefined, b1._sound);
    eq(undefined, b1._greeting);
    eq('dog says bark at the door', b1.argue('door'))

    delete b1['_sound']
    delete b1['_greeting']
    eq('dog says bark', b1.talk())

    var b2 = new SafeAnimal('bark', 'dog')
    b2._sound = 'meow'
    b2.breed = 'cat'
    eq('Animal', b2.name)
    eq('cat says bark', b2.talk())
    eq('cat says bark at the door', b2.argue('door'))
    eq(undefined, b2._sound);
    eq(undefined, b2._greeting);

    eq(true, b2.hasOwnProperty('breed'))
    eq(false, b2.hasOwnProperty('_sound'))
    eq(1,  Object.keys(b2).length)
    eq('breed',  Object.keys(b2)[0])
}

window.setTimeout(test, 0)
