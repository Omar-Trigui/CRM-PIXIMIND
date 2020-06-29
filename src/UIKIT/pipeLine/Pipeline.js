import React from "react";
import Board from "react-trello";
import DealDescription from "./DealDescription";
import _ from "lodash";
import { connect } from "react-redux";
import LaneHeader from "./LaneHeader";
import axios from "axios";
import { Spin, message ,Modal } from "antd";
import isEmpty from "is-empty";
const _accessToken = localStorage.getItem("access_token");
class Pipeline extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cards: [],
      loading: true,
      modalVisible: false,
    };
  }
  showModal = () => {
    this.setState({
      modalVisible: true,
    });
  };
  closeModal = () => {
    this.setState({
      modalVisible: false,
    });
  };
  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.deal.cards) !==
      JSON.stringify(this.props.deal.cards)
    )
      this.setState({ cards: this.props.deal.cards });
  }

  componentWillMount() {
    this.fetchDeals();
  }

  fetchDeals = () => {
    if (isEmpty(this.state.cards)) {
      this.setState({ cards: this.props.deal.cards, loading: false });
    } else {
      return;
    }
  };
  handleDragStart = () => {
    this.setState({ changed: true });
  };
  onCardClick = (cardId) => {
    this.showModal();
  };
  handleDragEnd = (
    cardId,
    sourceLaneId,
    targetLaneId,
    position,
    cardDetails
  ) => {
    let postion = _.findIndex(this.state.cards, function (card) {
      return card._id === cardId;
    });

    let cardData = {
      ID: cardId,
      target: targetLaneId,
      position: postion,
    };
    let action = {
      type: "CHANGE_POSITION",
      data: cardData,
    };
    setTimeout(() => {
      this.props.dispatch(action);
    }, 1000);
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/deal/changeDealPosition`;

    const config = {
      headers: {
        Authorization: "Bearer " + _accessToken,
      },
    };
    return axios
      .post(url, cardData, config)
      .then((response) => {
        if (response.status != 200)
          message.error("Server and you page are not in sync");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  getLaneLength = (stage) => {
    return this.state.cards.filter((card) => card.dealStage === stage).length;
  };
  getTotalRevenue = (stage) => {
    if (this.getLaneLength(stage) === 0) return 0;
    if (this.getLaneLength(stage) === 1) {
      return this.state.cards.filter((card) => card.dealStage === stage)[0]
        .dealAmount;
    }
    return this.state.cards
      .filter((card) => card.dealStage === stage)
      .reduce((total, amount) => {
        return parseInt(total.dealAmount) + parseInt(amount.dealAmount);
      });
  };
  render() {
    const data = {
      lanes: [
        {
          id: "new",
          title: "new",
          label: (
            <LaneHeader
              TotalRevenue={this.getTotalRevenue("new")}
              TotalDeals={this.getLaneLength("new")}
            />
          ),
          cards: this.state.cards
            .filter((card) => card.dealStage === "new")
            .map((card) => {
              return {
                id: card._id,
                title: card.dealName,
                current: "70",
                description: (
                  <DealDescription
                    Ratevalue={card.rate}
                    Revenue={card.dealAmount}
                    Customer={card.companyID.name}
                  />
                ),
                label: "5 mins",
                metadata: { sha: "be312a1" },
              };
            }),
        },
        {
          id: "Qualified",
          title: "Qualified",
          label: (
            <LaneHeader
              TotalRevenue={this.getTotalRevenue("Qualified")}
              TotalDeals={this.getLaneLength("Qualified")}
            />
          ),
          cards: this.state.cards
            .filter((card) => card.dealStage === "Qualified")
            .map((card) => {
              return {
                id: card._id,
                title: card.dealName,
                description: (
                  <DealDescription
                    Ratevalue={card.rate}
                    Revenue={card.dealAmount}
                    Customer={"omar trigui"}
                  />
                ),
                label: "5 mins",
                metadata: { sha: "be312a1" },
              };
            }),
        },
        {
          id: "Propostion",
          title: "Propostion",
          label: (
            <LaneHeader
              TotalRevenue={this.getTotalRevenue("Propostion")}
              TotalDeals={this.getLaneLength("Propostion")}
            />
          ),
          cards: this.state.cards
            .filter((card) => card.dealStage === "Propostion")
            .map((card) => {
              return {
                id: card._id,
                title: card.dealName,
                description: (
                  <DealDescription
                    Ratevalue={card.rate}
                    Revenue={card.dealAmount}
                    Customer={"omar trigui"}
                  />
                ),
                label: "5 mins",
                metadata: { sha: "be312a1" },
              };
            }),
        },
        {
          id: "Won",
          title: "Won",
          label: (
            <LaneHeader
              TotalRevenue={this.getTotalRevenue("Won")}
              TotalDeals={this.getLaneLength("Won")}
            />
          ),
          cards: this.state.cards
            .filter((card) => card.dealStage === "Won")
            .map((card) => {
              return {
                id: card._id,
                title: card.dealName,
                description: (
                  <DealDescription
                    Ratevalue={card.rate}
                    Revenue={card.dealAmount}
                    Customer={"omar trigui"}
                  />
                ),
                label: "5 mins",
                metadata: { sha: "be312a1" },
              };
            }),
        },
      ],
    };
    const loading = this.state.loading;
    return (
      <div>
        <Modal
          title="Basic Modal"
          visible={this.state.modalVisible}
          onOk={this.closeModal}
          onCancel={this.closeModal}>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
        <Board
          data={data}
          style={{ backgroundColor: "#f4f8fb", height: "80%" }}
          onDataChange={this.onDataChange}
          onCardClick={this.onCardClick}
          handleDragEnd={this.handleDragEnd}
          handleDragStart={this.handleDragStart}
        />
        {loading ? (
          <Spin style={{ height: "100%", width: "100%", marginTop: "15%" }} />
        ) : null}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    deal: state.deal,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => {
      dispatch(action);
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Pipeline);
