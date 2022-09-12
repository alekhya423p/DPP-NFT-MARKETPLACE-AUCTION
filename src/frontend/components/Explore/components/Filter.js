import React, { useState, useContext } from "react";
import { NftContext } from "../../../NftContext/NftProvider";
import Loader from "../../layout/Loader";
const Filter = (props) => {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const { categories } = useContext(NftContext);

  const handlePrice = () => {
    props.handleFilterPrice(min, max);
  };
  return (
    <>
      <div className="heading_nft bg-grey">
        <h6 className="p-0 mb-0">
          {" "}
          <i className="fa fa-filter text-grey"></i>&nbsp;Filter
        </h6>
      </div>
      <div className="card-body p-0">
        <div className="flex flex-column mb-0 mt-0 faq-section">
          <div className="row">
            <div className="col-md-12">
              <div id="accordion">
                <div className="card">
                  <div className="card-header  p-2 pt-3 pb-3" id="heading-1">
                    <h6 className="mb-0">
                      <a
                        role="button"
                        data-toggle="collapse"
                        href="#collapse-1"
                        aria-expanded="true"
                        aria-controls="collapse-1"
                      >
                        Status
                      </a>
                    </h6>
                    <div
                      id="collapse-1"
                      className="collapse show"
                      data-parent="#accordion"
                      aria-labelledby="heading-1"
                    >
                      <div className="detail_item staus_bar card-body pb-0 pt-3 pl-0 pr-0">
                        <ul className="flex-display mb-1">
                          <li>
                            <button type="button" onClick={() => props.handleFilterStatus('buy_now')}>Buy Now</button>
                          </li>
                          <li>
                            <button type="button" onClick={() => props.handleFilterStatus('on_auction')}>On Auction</button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="card-header  p-2 pt-3 pb-3" id="heading-2">
                    <h6 className="mb-0">
                      <a
                        role="button"
                        data-toggle="collapse"
                        href="#collapse-2"
                        aria-expanded="false"
                        aria-controls="collapse-2"
                      >
                        Price
                      </a>
                    </h6>
                    <div
                      id="collapse-2"
                      className="collapse"
                      data-parent="#accordion"
                      aria-labelledby="heading-2"
                    >
                      <div className="detail_item staus_bar card-body pb-0 pt-3 pl-0 pr-0">
                        {/* <select className="form-control form-group">
                            <option> United States Dollar (USD)</option>
                            <option> Ether (ETH)</option>
                            <option> Solana (SOL)</option>
                        </select> */}
                        <div className="min_max_box">
                          <label>
                            <input
                              type="number"
                              placeholder="Min"
                              className="form-control"
                              onChange={(e) => setMin(e.target.value)}
                            />
                          </label>
                          <span>to</span>
                          <label>
                            <input
                              type="number"
                              placeholder="Max"
                              className="form-control"
                              onChange={(e) => setMax(e.target.value)}
                            />
                          </label>
                        </div>
                        <div className="apply-btn pt-2">
                          <button
                            type="button"
                            onClick={() => handlePrice()}
                            value="Apply"
                            className="btn text-white btn-block btn-primary custom-color-bttn"
                          >{props.loader ? <Loader />: 'Apply'}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-header  p-2 pt-3 pb-3" id="heading-3">
                    <h6 className="mb-0">
                      <a
                        role="button"
                        data-toggle="collapse"
                        href="#collapse-3"
                        aria-expanded="false"
                        aria-controls="collapse-3"
                      >
                        Categories
                      </a>
                    </h6>
                    <div
                      id="collapse-3"
                      className="collapse"
                      data-parent="#accordion"
                      aria-labelledby="heading-3"
                    >
                      <div className="detail_item staus_bar card-body pb-0 pt-3 pl-0 pr-0">
                        <ul className="mb-1 categories">
                          <li onClick={() => props.handleFilterCategory("")}>
                            <a href="#/">
                              <i className="far fa-palette"></i>{" "}
                              <span className="pl-2">All</span>
                            </a>
                          </li>
                          {categories &&
                            categories.map((item, index) => (
                              <li
                                key={index}
                                onClick={() =>
                                  props.handleFilterCategory(item.slug)
                                }
                              >
                                <a href="#/">
                                  <i className="far fa-palette"></i>{" "}
                                  <span className="pl-2">{item.name}</span>
                                </a>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Filter;
