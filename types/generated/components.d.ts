import type { Schema, Struct } from '@strapi/strapi';

export interface PortfolioChip extends Struct.ComponentSchema {
  collectionName: 'components_portfolio_chips';
  info: {
    displayName: 'chip';
    icon: 'code';
  };
  attributes: {
    label: Schema.Attribute.String;
  };
}

export interface PortfolioProduct extends Struct.ComponentSchema {
  collectionName: 'components_portfolio_products';
  info: {
    displayName: 'Project';
    icon: 'stack';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    label: Schema.Attribute.String;
    skills: Schema.Attribute.Component<'portfolio.chip', true>;
  };
}

export interface PortfolioSection extends Struct.ComponentSchema {
  collectionName: 'components_portfolio_sections';
  info: {
    displayName: 'Section';
    icon: 'archive';
  };
  attributes: {
    cta_btn: Schema.Attribute.Component<'portfolio.section-header', true>;
    projects: Schema.Attribute.Relation<'oneToMany', 'api::project.project'>;
    section_descriptions: Schema.Attribute.Text;
    section_key: Schema.Attribute.String;
    section_title: Schema.Attribute.String;
  };
}

export interface PortfolioSectionHeader extends Struct.ComponentSchema {
  collectionName: 'components_portfolio_section_headers';
  info: {
    displayName: 'Button';
    icon: 'cursor';
  };
  attributes: {
    icon: Schema.Attribute.String;
    key: Schema.Attribute.String;
    label: Schema.Attribute.String;
    url: Schema.Attribute.String;
    variant: Schema.Attribute.String;
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

export interface SharedResponsibilities extends Struct.ComponentSchema {
  collectionName: 'components_shared_responsibilities';
  info: {
    displayName: 'responsibilities';
  };
  attributes: {
    description: Schema.Attribute.Text;
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

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'portfolio.chip': PortfolioChip;
      'portfolio.product': PortfolioProduct;
      'portfolio.section': PortfolioSection;
      'portfolio.section-header': PortfolioSectionHeader;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.responsibilities': SharedResponsibilities;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
    }
  }
}
