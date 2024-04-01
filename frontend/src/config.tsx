export const categorySchema = {
    "$id": "/Category",
    "type": "object",
    "maxProperties": 2,
    "required": ["name"],
    "additionalProperties": false,
    "properties": {
        "name": {"type": "string", "minLength": 3, "maxLength": 64},
        "children": {
            "type": "array",
            "items": {"$ref": "/Category"},
            "minItems": 1,
        }
    },
};
