interface BadgeProps {
    text: string;
    type: "primary" | "secondary" | "success" | "danger";
    style?: React.CSSProperties;
}

const Badge = ({ text, type, style }: BadgeProps) => {

    const badgeStyles = {
        padding: "4px 8px",
        backgroundColor: type === "primary" ? "#007bff"
            : type === "secondary" ? "#6c757d"
                : type === "success" ? "#28a745"
                    : type === "danger"
                        ? "#dc3545"
                        : "#007bff",
        color: "#fff",
        borderRadius: 4
    };

    return (
        <span style={{ ...badgeStyles, ...style }}>
            {text}
        </span>
    );
}

export default Badge;