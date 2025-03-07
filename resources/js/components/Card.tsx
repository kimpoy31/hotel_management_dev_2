import React from "react";

const Card = () => {
    return (
        <div className="card flex-none w-full max-w-7xl bg-base-100 card-md shadow-sm">
            <div className="card-body">
                <h2 className="card-title">Medium Card</h2>
                <p>
                    A card component has a figure, a body part, and inside body
                    there are title and actions parts
                </p>
                <div className="justify-end card-actions">
                    <button className="btn btn-primary">Buy Now</button>
                </div>
            </div>
        </div>
    );
};

export default Card;
