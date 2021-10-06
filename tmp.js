(function () {
    (function () {
        (function () {
            var a = new Error("123456")
            console.error(a)
            console.log(a.stack.split("\n").slice(0, 4).join("\n"))
        })()
    })()
})()
