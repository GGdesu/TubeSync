
  const generateId = (length) => {
    let id = (Math.random() * Date.now()).toString(32).replace(".", "")
    return id.slice(0,length)
}


  export {
    generateId
  }