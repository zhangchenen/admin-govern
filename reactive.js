let price = 10
let count = 2
let total = price * count
let discount = 0.9
let targetMap = new WeakMap()
let activeEffect=null;
function track(target, key, effect) {
  if(activeEffect)
  {
     let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
     deps.add(effect)
  }
  
}
function trigger(target,key) {
    let depsMap = targetMap.get(target)
    if(depsMap)
    {
        let deps = depsMap.get(key)
        if(deps)
        {
            deps.forEach(effect => {
                effect()
            }
        }

    }
}
function reactive(target)
{
    const handler = {
        // 为啥不直接返回target[key]，而是用Reflect反射代理
        // 是为了避免在对象中写自己的getter这种骚操作，导致this指向原对象导致proxy无法拦截
        get(target,key,receiver)
        {
             track(target,key,effect)
             return Reflect.get(target,key,receiver)
        }
        set(target,key,value,receiver)
        {
             let result = Reflect.set(target,key,value,receiver)
             let oldvalue = target[key]
            //  当确认是新值时才更新
             if(result && oldvalue !== value)
             {
                trigger(target,key)
             }
             return result
        }

    }
}
// function track(key, effect) {
//   let dep = depsMap.get(key)
//   if (!dep) {
//     depsMap.set(key, (dep = new Set()))
//   }
//   dep.add(effect)
// }
// function trigger(key) {
//   let dep = depsMap.get(key)
//   if (dep) {
//     dep.forEach((effect) => {
//       effect()
//     })
//   }
// }

// const effect = () => {
//   total = price * count
//   console.log(total)
// }
// effect()
// track('price', effect)
// price = 20
// trigger('price')

// const effect1 = () => {
//   total = price * count * discount
//   console.log(total)
// }
// // 这里用sets的原因是因为多个属性可能有共同的effect，比如文中这个effect
// // 有两个属性依赖它那么，这两个属性共有一个effect，但对于我们来说不必重复收集effect，所以用set
// const deps = new Set()
// let effects = [effect, effect1]
// function track() {
//   effects.forEach((effect) => {
//     deps.add(effect)
//   })
// }
// track()
// function trigger() {
//   deps.forEach((effect) => {
//     effect()
//   })
// }
