# react hooks
在react hooks出现之前，我们写react组件主要主要分为无状态组件(Function)和有状态组件(Class)

```js
function Example(props) {
  return (
    <div>
      <p>You clicked {props.count} times</p>
      <button onClick={props.setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
这是一个无状态组件，其所有的渲染逻辑都依赖于props，自身不维护任何状态；


```js
import React, { Component } from 'react';

export default class App extends Component {
  state = {
    count: 0
  }

  setCount = count => {
    this.setState({ count })
  }

  render() {
    return (<Example count={this.state.count} setCount={this.setCount}></Example>)
  }
}
```
这是一个有状态组件，定义了一些状态逻辑；



react hook出现之后可以让函数组件也可以使用React state了
```js
import React, { useState } from 'react';

function Example() {
  // 声明一个叫 "count" 的 state 变量
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
useState是react自带的一个hook函数，它的作用就是用来声明状态变量。useState这个函数接收的参数是我们的状态初始值（initial state），它返回了一个数组，这个数组的第[0]项是当前当前的状态值，第[1]项是可以改变状态值的方法函数。
所以我们做的事情其实就是，声明了一个状态变量count，把它的初始值设为0，同时提供了一个可以更改count的函数setCount。



如果不使用hook组件的话需要这样来实现
```js
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```
我们用class来创建react组件时，有一件很麻烦的事情，就是this的指向问题。为了保证this的指向正确，我们要经常写这样的代码：this.handleClick = this.handleClick.bind(this)，或者是这样的代码：<button onClick={() => this.handleClick(e)}>。一旦我们不小心忘了绑定this，各种bug就随之而来，很麻烦。




我们写的有状态组件，通常会产生很多的副作用（side effect），比如发起ajax请求获取数据，添加一些监听的注册和取消注册，手动修改dom等等。我们之前都把这些副作用的函数写在生命周期函数钩子里，比如componentDidMount，componentDidUpdate和componentWillUnmount。而现在的useEffect就相当与这些声明周期函数钩子的集合体。它以一抵三。
同时，由于hooks可以反复多次使用，相互独立。所以我们合理的做法是，给每一个副作用一个单独的useEffect钩子。这样一来，这些副作用不再一股脑堆在生命周期钩子里，代码变得更加清晰。
```js
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```


```js
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```



需要清除的 effect
```js
import React, { useState, useEffect } from 'react';

export default function Example() {
    const [count, setCount] = useState(0);

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        // Update the document title using the browser API
        const $btn = document.getElementById('button');
        const showCount = function () {
            alert(`the count value is ${count}`);
        };

        $btn.addEventListener('click', showCount);

        return function cleanup() {
            $btn.removeEventListener('click', showCount);
        }
    });

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
            <button id="button">show count</button>
        </div>
    );
}
```



在react hook出现之前我们是如何复用react的状态逻辑的呢
第一种  高阶组件的方式
```js
import React, { Component } from 'react';

function Example1(props) {
    return (
        <div>
            <p>这个是购买衣服的页面</p>
            <p>You clicked {props.count} times</p>
            <button onClick={() => props.setCount(props.count + 1)}>
                Click me
            </button>
        </div>
    );
}

function Example2(props) {
    return (
        <div>
            <p>这个是购买电脑的页面</p>
            <p>You clicked {props.count} times</p>
            <button onClick={() => props.setCount(props.count + 1)}>
                Click me
            </button>
        </div>
    );
}

const withShoppingCard = TargetComponent => {
    class ShoppingCard extends Component {
        state = {
            count: 0
        };

        setCount = count => {
            this.setState({ count })
        };

        render() {
            return (<TargetComponent count={this.state.count} setCount={this.setCount}/>)
        }
    }

    return ShoppingCard;
};

const HocExample1 = withShoppingCard(Example1);
const HocExample2 = withShoppingCard(Example2);

export default class App extends Component {
    render() {
        const Example = 1 === 2 ? HocExample1 : HocExample2;

        return (
            <Example/>
        );
    }
}
```


第二种render props的方式
```js
import React, { Component } from 'react';

function Example1(props) {
    return (
        <div>
            <p>这个是购买衣服的页面</p>
            <p>You clicked {props.count} times</p>
            <button onClick={() => props.setCount(props.count + 1)}>
                Click me
            </button>
        </div>
    );
}

function Example2(props) {
    return (
        <div>
            <p>这个是购买电脑的页面</p>
            <p>You clicked {props.count} times</p>
            <button onClick={() => props.setCount(props.count + 1)}>
                Click me
            </button>
        </div>
    );
}

class Shell extends Component {
    state = {
        count: 0
    };

    setCount = count => {
        this.setState({ count })
    };

    render() {
        return (
            <div>
                {this.props.render({
                    count: this.state.count,
                    setCount: this.setCount
                })}
            </div>
        )
    }
}

export default class App extends Component {
    render() {
        const Example = 1 === 2 ? Example1 : Example2;

        return (
            <Shell
                render={props => <Example {...props}/>}
            />);
    }
}
```
