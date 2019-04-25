let flag: number | null = null;

const loopCallbacks: Array<FrameRequestCallback | null> = [];

function callLoop(time: number) {
  loopCallbacks.forEach(cb => typeof cb !== 'function' || cb(time));
  flag = requestAnimationFrame(callLoop);
}

export function loop(callback: FrameRequestCallback) {
  const index = loopCallbacks.indexOf(null);
  if (index === -1) {
    loopCallbacks[loopCallbacks.length] = callback;
  } else {
    loopCallbacks[index] = callback;
  }
  // 没有设定 requestAnimationFrame 时自动设置
  if (flag === null) {
    flag = requestAnimationFrame(callLoop);
  }

  // 用于取消 loop
  return index === -1 ? loopCallbacks.length - 1 : index;
}

export function cancelLoop(index: number) {
  if (loopCallbacks[index]) {
    loopCallbacks[index] = null;
  }

  if (loopCallbacks.lastIndexOf(null) === loopCallbacks.length - 1) {
    for (let i = loopCallbacks.length - 1; i >= 0; i--) {
      if (loopCallbacks[i] === null) {
        loopCallbacks.pop();
      } else {
        break;
      }
    }
  }

  if (!loopCallbacks.length && flag) {
    cancelAnimationFrame(flag);
  }
}
