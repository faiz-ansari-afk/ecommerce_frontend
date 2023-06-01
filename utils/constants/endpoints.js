

export const CART_ENDPOINT = (id) => {
    const route = `${process.env.NEXT_PUBLIC_WEBSITE}/api/carts`
    if(id){
        return `${route}/${id}`
    }
    return route
}