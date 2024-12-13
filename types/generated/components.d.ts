import type { Schema, Struct } from '@strapi/strapi';

export interface RouteCountry extends Struct.ComponentSchema {
  collectionName: 'components_route_country';
  info: {
    description: '';
    displayName: 'country';
    icon: 'pinMap';
  };
  attributes: {
    countries: Schema.Attribute.Relation<'oneToMany', 'api::country.country'>;
  };
}

export interface RouteDestination extends Struct.ComponentSchema {
  collectionName: 'components_route_destination';
  info: {
    description: '';
    displayName: 'city';
    icon: 'pinMap';
  };
  attributes: {
    city: Schema.Attribute.Relation<'oneToOne', 'api::city.city'>;
  };
}

export interface RouteLocation extends Struct.ComponentSchema {
  collectionName: 'components_route_locations';
  info: {
    description: '';
    displayName: 'airport';
  };
  attributes: {
    airport: Schema.Attribute.Relation<'oneToOne', 'api::airport.airport'>;
  };
}

export interface SharedFromLocation extends Struct.ComponentSchema {
  collectionName: 'components_shared_from_locations';
  info: {
    displayName: 'From Location';
  };
  attributes: {
    airports: Schema.Attribute.Relation<'oneToMany', 'api::airport.airport'>;
    countries: Schema.Attribute.Relation<'oneToMany', 'api::country.country'>;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface VehicleTypeVehiclePrices extends Struct.ComponentSchema {
  collectionName: 'components_vehicle_type_vehicle_prices';
  info: {
    description: '';
    displayName: 'vehicle';
  };
  attributes: {
    currency: Schema.Attribute.Enumeration<['EUR', 'USD', 'GBP']>;
    price: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<5>;
    vehicle_type: Schema.Attribute.Relation<
      'oneToMany',
      'api::vehicle-type.vehicle-type'
    >;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'route.country': RouteCountry;
      'route.destination': RouteDestination;
      'route.location': RouteLocation;
      'shared.from-location': SharedFromLocation;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'vehicle-type.vehicle-prices': VehicleTypeVehiclePrices;
    }
  }
}
