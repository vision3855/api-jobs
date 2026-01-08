const Products = require("../models/products.model")

async function getAllProducts(req, res){
    const {featured, company, name, sort, fields, numericFilters} = req.query;
    const queryObj = {};
    if (featured) {
        queryObj.featured = featured === 'true' ? 'true' : 'false';
    }
    if (company) {
        queryObj.company = company;
    }
    if (name) {
        queryObj.name = { $regex: name, $options: 'i' };
    }
    if (numericFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte'
        }
        const regex = /\b(<|>|>=|=|<=)\b/g;
        let filters = numericFilters.replace(regex, (match)=>`-${operatorMap[match]}-`);
        const options = ['price', 'rating'];
        filters = filters.split(',').forEach(item => {
            const [field, operator, value] = item.split('-');
            if (options.includes(field)){
                queryObj[field] = { [operator] : Number(value) }
            }
        });
        
    }
    let result = Products.find(queryObj);
    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else {
        result = result.sort('createdAt');
    }
    if (fields) {
        const fieldsList = fields.split(',').join(' ');
        result = result.select(fieldsList);
    }
    

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page-1) * limit

    result = result.skip(skip).limit(limit);

    console.log(queryObj);
    
    const product = await result;
    
    res.status(200).json({product, nbHits: product.length})
}


module.exports = {getAllProducts}