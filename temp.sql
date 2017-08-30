SELECT *
FROM ( 
    SELECT productId, categoryId, unitId, productName,
    productDesc, productImgFilename, productActive, productDeleted,
    productTS, sizeTypeId, sizeTypeAmount, sizeTypeDesc, sizeTypeDeleted,
    (storageInventory + SUM(transferChangeStorage)) AS storage,
    (counterInventory + SUM(transferChangeCounter)) AS counter
    FROM (
        SELECT productId, productName, productDesc, productImgFilename, productActive, productDeleted, productTS, sizeTypeId, sizeTypeAmount, sizeTypeDesc, sizeTypeDeleted, storageInventory, counterInventory, categoryId, categoryName, categoryDesc, categoryDeleted, unitId, unitShort, unitFull
        FROM (
            SELECT *
            FROM (
                SELECT productId, refCategory, refUnit, productName,
                productDesc, productImgFilename, productActive, productDeleted,
                productTS, sizeTypeId, sizeTypeAmount, sizeTypeDesc, sizeTypeDeleted ,
                Sum(transactionChangeTotal)-Sum(transactionChangeCounter) AS storageInventory,
                Sum(transactionChangeCounter) AS counterInventory
                FROM (
                    SELECT *
                    FROM transactions
                    INNER JOIN products ON (refProduct = productId)) AS transactionsProducts
                INNER JOIN size_types ON (refSizeType = sizeTypeId)
                GROUP BY refProduct, refSizeType) AS inventoryWithoutCosts
            WHERE productActive = true) AS inventoryWithCosts
        INNER JOIN product_categories ON (refCategory = categoryId)
        INNER JOIN product_units ON (refUnit = unitId)) AS inventory
    INNER JOIN event_transfers ON (refSizeType = sizeTypeId AND refProduct = productId)
    WHERE refEvent = ?
    GROUP BY refProduct, refSizeType) AS transferInventoryAll
INNER JOIN product_sizes ON (productId = refProduct AND sizeTypeId = refSizeType)
WHERE sizeActive = true OR storage > 0 OR counter > 0