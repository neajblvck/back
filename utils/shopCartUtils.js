// const calculTotalAmountFromDB = (shopCart, productsFromDb) => {

//     let totalAmount = 0;

//     const productMap = new Map(productsFromDb.map(product => [product._id.toString(), product]));

//     shopCart.forEach(cartItem => {
//         const productFromDb = productMap.get(cartItem._id.toString());

//         if (!productFromDb) {
//             throw new Error('Un problème est survenu avec le panier');
//         }

//         if (cartItem.prixProduct !== productFromDb.prixProduct) {
//             throw new Error('Un problème est survenu avec le panier');
//         }
//         let itemTotal = cartItem.prixProduct * (cartItem.quantity || 1);

//         if (cartItem.selectedCustomProducts) {
//             cartItem.selectedCustomProducts.forEach(customProduct => {
//                 const customProductFromDb = productFromDb.customProducts.find(cp => cp._id.toString() === customProduct._id.toString());
//                 if (!customProductFromDb) {
//                     throw new Error('Un problème est survenu avec le panier');
//                 }
//                 if (customProduct.additionalCost !== customProductFromDb.additionalCost) {
//                     throw new Error('Un problème est survenu avec le panier');
//                 }
//                 const oldTotal = itemTotal
//                 itemTotal += customProduct.additionalCost * (cartItem.quantity || 1);
               

//             });
//         }

//         if (cartItem.selectedOptions) {
//             cartItem.selectedOptions.forEach(selectedOption => {
//                 const optionFromDb = productFromDb.options.find(o => o._id.toString() === selectedOption._id.toString());
//                 if (!optionFromDb) {
//                     throw new Error('Un problème est survenu avec le panier');
//                 }

//                 if (selectedOption.choices.length < optionFromDb.qtMinimal || selectedOption.choices.length > optionFromDb.qtMaximal) {
//                     throw new Error('Un problème est survenu avec le panier');
//                 }

//                 selectedOption.choices.forEach(choice => {
//                     const choiceFromDb = optionFromDb.choices.find(c => c._id.toString() === choice._id.toString());
//                     if (!choiceFromDb) {
//                         throw new Error('Un problème est survenu avec le panier');
//                     }
//                     if (choice.additionalCost !== choiceFromDb.additionalCost) {
//                         throw new Error('Un problème est survenu avec le panier');
//                     }
//                     itemTotal += choice.additionalCost * (cartItem.quantity || 1);
//                 });
//             });
//         }

//         totalAmount += itemTotal;
//     });

//     return totalAmount;
// };

// module.exports = {
//     calculTotalAmountFromDB,
// };

const calculTotalAmountFromDB = (shopCart, productsFromDb) => {
    if (!Array.isArray(shopCart) || !Array.isArray(productsFromDb)) {
        throw new Error('Les données du panier ou des produits ne sont pas valides');
    }

    let totalAmount = 0;
    const productMap = new Map(productsFromDb.map(product => [product._id.toString(), product]));

    shopCart.forEach(cartItem => {
        let itemTotal = Math.round(cartItem.prixProduct * 100) * (cartItem.quantity || 1); // prix en centimes

        if (cartItem.selectedCustomProducts) {
            cartItem.selectedCustomProducts.forEach(customProduct => {
                const customProductFromDb = productMap.get(cartItem._id.toString()).customProducts.find(cp => cp._id.toString() === customProduct._id.toString());
                if (!customProductFromDb) {
                    throw new Error('Un problème est survenu avec le panier');
                }
                if (Math.round(customProduct.additionalCost * 100) !== Math.round(customProductFromDb.additionalCost * 100)) {
                    throw new Error('Un problème est survenu avec le panier');
                }
                itemTotal += Math.round(customProduct.additionalCost * 100) * (cartItem.quantity || 1);
            });
        }

        if (cartItem.selectedOptions) {
            cartItem.selectedOptions.forEach(selectedOption => {
                const optionFromDb = productMap.get(cartItem._id.toString()).options.find(o => o._id.toString() === selectedOption._id.toString());
                if (!optionFromDb) {
                    throw new Error('Un problème est survenu avec le panier');
                }

                if (selectedOption.choices.length < optionFromDb.qtMinimal || selectedOption.choices.length > optionFromDb.qtMaximal) {
                    throw new Error('Un problème est survenu avec le panier');
                }

                selectedOption.choices.forEach(choice => {
                    const choiceFromDb = optionFromDb.choices.find(c => c._id.toString() === choice._id.toString());
                    if (!choiceFromDb) {
                        throw new Error('Un problème est survenu avec le panier');
                    }
                    if (Math.round(choice.additionalCost * 100) !== Math.round(choiceFromDb.additionalCost * 100)) {
                        throw new Error('Un problème est survenu avec le panier');
                    }
                    itemTotal += Math.round(choice.additionalCost * 100) * (cartItem.quantity || 1);
                });
            });
        }

        totalAmount += itemTotal;
    });

    return totalAmount / 100; // Convertir le total en euros
};

module.exports = {
    calculTotalAmountFromDB,
};
