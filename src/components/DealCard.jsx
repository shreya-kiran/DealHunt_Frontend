import { Link } from 'react-router-dom';
import { fmt, scoreLabel } from '../data/products';

export default function DealCard({ product, index }) {
  const sl = scoreLabel(product.dealScore);
  const delay = `${(index * 0.05).toFixed(2)}s`;

  return (
    <Link
      to={`/deal/${product.id}`}
      className="deal-card"
      style={{ animationDelay: delay }}
    >
      <div className="card-image-wrap">
        {product.image ? (
          <img src={product.image} alt={product.name} className="card-image" />
        ) : (
          <>
            <div className="card-image-bg" style={{ background: product.gradient }} />
            <div className="card-image-bg" style={{ background: product.gradient, opacity: 0.12 }} />
            <span className="card-emoji">{product.emoji}</span>
          </>
        )}
        <span className="platform-badge">{product.platform}</span>
        {product.discount > 0
          ? <span className="discount-badge">-{product.discount}%</span>
          : <span className="discount-badge no-discount">New</span>
        }
        <div className="deal-score-mini">
          <span className={`score-dot ${sl.cls}`} />
          <span>{product.dealScore}/100</span>
        </div>
      </div>

      <div className="card-body">
        <div className="card-title">{product.name}</div>
        <div className="card-desc">{product.description}</div>
        <div className="card-prices">
          {product.discount > 0 && (
            <span className="original-price">{fmt(product.originalPrice)}</span>
          )}
          <span className="deal-price">{fmt(product.price)}</span>
        </div>
        <div className="card-rating">
          <span className="stars">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
          {' '}{product.rating} ({product.reviews.toLocaleString('en-IN')})
        </div>
        <span className="card-cta">
          View Deal
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
