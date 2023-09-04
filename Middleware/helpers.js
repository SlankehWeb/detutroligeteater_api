import { query } from "express"

/**
 * 
 * @param {Object} req 
 * @param {String} default_attr 
 * @returns 
 */
export const QueryParamsHandle = (req, default_attr) => {
	const attr = (req.query.attributes) ? req.query.attributes.trim() : default_attr.trim()
	const query_params = {
		sort_key: [req.query.orderby || 'id'],
		limit: Number(req.query.limit) || 10000000,
		attributes: attr.split(',').map(str => str.trim())
	}
	query_params.sort_key.push(req.query.dir || 'ASC')
	console.log(query_params);
	return query_params
}

export const JsonResponder = (strCustomMessage, errorMessage, statusCode) => {
	return { 
		status: statusCode || 200,
		message: strCustomMessage,
		details: errorMessage || `-`
	}
	
}