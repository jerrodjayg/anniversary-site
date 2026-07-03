import { FLOWER_SRC } from "../data";

export default function FlowerMessage() {
  return (
    <div className="flower-stage">
      <div className="flower-scene">
        <div id="flower">
          <img className="flower-img" alt="pink lilies" src={FLOWER_SRC} />
        </div>
        <span className="spark s1" />
        <span className="spark s2" />
        <span className="spark s3" />
        <span className="spark s4" />
        <span className="spark s5" />
      </div>
      <p className="flower-note">
        flowers for<br />
        my princess
      </p>
    </div>
  );
}
