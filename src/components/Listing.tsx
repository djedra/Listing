import React from 'react';

interface ItemImage {
    url_570xN: string;
}

interface Item {
    listing_id: number;
    url: string;
    MainImage: ItemImage | null;
    title: string | null;
    price: string | null;
    currency_code: string | null;
    quantity: number | null;
}

interface ListingProps {
    items?: (Partial<Item> | null)[];
}

const Listing: React.FC<ListingProps> = ({ items = [] }) => {
    const filteredItems = React.useMemo(() => {
        return items.filter((item): item is Item => {
            if (!item?.listing_id) return false;
            const hasEssentialData = 
                !!item.MainImage?.url_570xN ||
                !!item.title ||
                (!!item.price && !!item.currency_code);
            return hasEssentialData;
        });
    }, [items]);
    
    const formatTitle = React.useCallback(
        (title: string | null | undefined): string => {
            if (!title?.trim()) return '';
            return title.length > 50 ? `${title.substring(0, 50)}…` : title;
        }, 
    []);
    
    const formatPrice = React.useCallback(
        (price: string | null | undefined, currencyCode: string | null | undefined): string => {
            if (!price || !currencyCode) return '';
            const numericPrice = parseFloat(price).toFixed(2);
            switch (currencyCode.toUpperCase()) {
                case 'USD': return `$${numericPrice}`;
                case 'EUR': return `€${numericPrice}`;
                default: return `${numericPrice} ${currencyCode}`;
            }
        }, 
    []);

    const getQuantityLevel = React.useCallback(
        (quantity: number | null | undefined): string => {
            if (!quantity || quantity <= 0) return '';
            if (quantity <= 10) return 'level-low';
            if (quantity <= 20) return 'level-medium';
            return 'level-high';
        }, 
    []);

    if (filteredItems.length === 0) {
        return <div className="item-list-empty">No items to display</div>;
    }

    return (
        <div className="item-list">
            {filteredItems.map((item) => {
                const { MainImage, title, price, currency_code, quantity, url, listing_id } = item;
                const hasImage = !!MainImage?.url_570xN;
                const hasTitle = !!title;
                const hasPrice = !!price && !!currency_code;

                if (!hasImage && !hasTitle && !hasPrice) {
                    return null;
                }

                return (
                    <div className="item" key={listing_id}>
                        {hasImage && (
                            <div className="item-image">
                                <a href={url || '#'}>
                                    <img 
                                        src={MainImage.url_570xN} 
                                        alt={title || 'Etsy item'} 
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                        }}
                                    />
                                </a>
                            </div>
                        )}
                    
                        <div className="item-details">
                            {hasTitle && <p className="item-title">{formatTitle(title)}</p>}
                            {hasPrice && (
                                <p className="item-price">
                                    {formatPrice(price, currency_code)}
                                </p>
                            )}
                            {quantity && quantity > 0 && (
                                <p className={`item-quantity ${getQuantityLevel(quantity)}`}>
                                    {`${quantity} left`}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default React.memo(Listing);