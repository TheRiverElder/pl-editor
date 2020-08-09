const Objects = {
    /**
     * 使用填充内容覆盖原始对象，若一个属性只存在于填充内容中，而不存在原始对象中，则忽略
     * @param {Object} oldObj 原始对象 
     * @param {Object} filler 填充内容
     * @returns {Object} 返回原始对象
     */
    cover(oldObj, filler) {
        for (let key of Object.keys(oldObj)) {
            if (filler[key] !== undefined) {
                oldObj[key] = filler[key];
            }
        }
        return oldObj;
    }
};

const Arrays = {

    /**
     * 找出一个对象数组中相同键对应的不唯一的值
     * @param {Array<Object>} array 数组
     * @param {String} key ID的键
     * @returns {Array<String>} 冲突键的值
     */
    conflict(array, key) {
        const set = new Set();
        const result = new Set();
        for (let elem of array) {
            if (set.has(elem[key])) {
                result.add(elem[key]);
            }
            set.add(elem[key]);
        }
        return [...result];
    }
};

export {
    Objects,
    Arrays,
}
