const rand = function() {
    return Math.random().toString(36).substr(2); // remove `0.`
};

const tokenGenerate = () => {
    return (rand() + rand()).toUpperCase()
}

module.exports = tokenGenerate;